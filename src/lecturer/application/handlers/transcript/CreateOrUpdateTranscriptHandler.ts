import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ValidationError from '@core/domain/errors/ValidationError';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import TranscriptDetails, { ITranscriptDetail } from '@core/domain/validate-objects/TranscriptDetails';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import Assign from '@core/domain/entities/Assign';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import Transcript from '@core/domain/entities/Transcript';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import Lecturer from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import StudentTerm from '@core/domain/entities/StudentTerm';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	assign: Assign;
	transcriptDetails: ITranscriptDetail[];
	lecturerTerm: LecturerTerm;
	studentTerm: StudentTerm;
}
@injectable()
export default class CreateOrUpdateTranscriptHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('TranscriptDao') private transcriptDao!: ITranscriptDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const assignId = this.errorCollector.collect('assignId', () => EntityId.validate({ value: request.body['assignId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const lecturerId = Number(request.headers['id']);
		const transcriptDetails = this.errorCollector.collect('transcripts', () => TranscriptDetails.validate({ value: request.body['transcripts'] }));
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let assign = await this.assignDao.findEntityById(assignId);
		if (!assign) throw new NotFoundError('assign not found');

		const groupStudent = await this.groupDao.findEntityById(assign.groupId);
		if (!groupStudent) throw new NotFoundError('group student not found');

		const groupLecturer = await this.groupLecturerDao.findEntityById(assign.groupLecturerId);
		if (!groupLecturer) throw new NotFoundError('group lecturer not found');

		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		let studentTerm = await this.studentTermDao.findOne(groupStudent?.termId!, studentId);
		if (!studentTerm) throw new NotFoundError('studentTerm not found');

		let lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) throw new NotFoundError('lecturer not found');

		let lecturerTerm = await this.lecturerTermDao.findOne(groupStudent?.termId!, lecturerId);
		if (!lecturerTerm) throw new NotFoundError('lecturer Term not found');

		const groupMembertudents = await this.groupMemberDao.findOne({
			studentTermId: studentTerm.id!,
			groupId: groupStudent.id!,
		});

		if (!groupMembertudents) {
			throw new ErrorCode('STUDENT_NOT_IN_THIS_GROUP', `Student not in group ${assign.groupId}`);
		}

		const groupMemberLecturer = await this.groupLecturerMemberDao.findOne({
			groupLecturerId: groupLecturer.id!,
			lecturerTermId: lecturerTerm.id!,
		});

		if (!groupMemberLecturer) {
			throw new ErrorCode('LECTURER_NOT_IN_THIS_GROUP', `Lecturer not in group ${assign.groupLecturerId}`);
		}
		//  Check time term

		return {
			transcriptDetails,
			assign,
			lecturerTerm,
			studentTerm,
		};
	}

	async handle(request: Request) {
		const { transcriptDetails, assign, lecturerTerm, studentTerm } = await this.validate(request);
		const groupLecturer = await this.groupLecturerDao.findEntityById(assign.groupLecturerId);
		const evaluations = await this.evaluationDao.findAll(groupLecturer?.termId, assign.typeEvaluation);
		const evaluationMap = new Map<number, Evaluation>();
		evaluations.forEach(evaluation => {
			evaluationMap.set(evaluation.id!, evaluation);
		});
		const transcripts = [];
		for (const transcriptDetail of transcriptDetails) {
			// check evaluation correct
			const evaluation = evaluationMap.get(transcriptDetail.idEvaluation);
			if (!evaluation || transcriptDetail.grade > evaluation.gradeMax) {
				continue;
			}
			let transcript = await this.transcriptDao.findOne({
				lecturerTermId: lecturerTerm.id!,
				evaluationId: evaluation.id!,
				studentTermId: studentTerm.id!,
			});

			if (transcript) {
				// update grade
				transcript.update({ grade: transcriptDetail.grade });
				transcript = await this.transcriptDao.updateEntity(transcript);
			} else {
				// insert grade
				transcript = await this.transcriptDao.insertEntity(
					Transcript.create({
						lecturerTerm,
						evaluation,
						grade: transcriptDetail.grade,
						studentTerm,
					})
				);
			}
			transcripts.push(transcript);
		}
		return transcripts.map(e => e.toJSON);
	}
}
