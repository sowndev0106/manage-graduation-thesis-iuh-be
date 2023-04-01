import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ValidationError from '@core/domain/errors/ValidationError';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import TranscriptDetails, { ITranscriptDetail } from '@core/domain/validate-objects/TranscriptDetails';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import Assign from '@core/domain/entities/Assign';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Transcript from '@core/domain/entities/Transcript';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';

interface ValidatedInput {
	assign: Assign;
	transcriptDetails: ITranscriptDetail[];
	lecturerId: number;
	student: Student;
}
@injectable()
export default class CreateOrUpdateTranscriptHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('TranscriptDao') private transcriptDao!: ITranscriptDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const assignId = this.errorCollector.collect('assignId', () => EntityId.validate({ value: request.body['assignId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const lecturerId = Number(request.headers['id']);
		const transcriptDetails = this.errorCollector.collect('transcripts', () => TranscriptDetails.validate({ value: request.body['transcripts'] }));
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		console.log({ transcriptDetails });
		let assign = await this.assignDao.findEntityById(assignId);
		if (!assign) throw new NotFoundError('assign not found');

		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		const groupMemberStudents = await this.groupMemberDao.findByGroupId(assign.groupId!);

		const isExistStudent = groupMemberStudents.find(e => e.studentId == student!.id);
		if (!isExistStudent) {
			throw new Error(`Student not in group ${assign.groupId}`);
		}

		const groupMemberLecturers = await this.groupLecturerMemberDao.findAll(assign.groupLecturerId!);
		const isExistLecturer = groupMemberLecturers.find(e => e.lecturerId == lecturerId);
		if (!isExistLecturer) {
			throw new Error(`Lecturer not in group ${assign.groupLecturerId}`);
		}

		return {
			transcriptDetails,
			assign,
			lecturerId,
			student,
		};
	}

	async handle(request: Request) {
		const { transcriptDetails, assign, lecturerId, student } = await this.validate(request);
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
			if (!evaluation) {
				continue;
			}
			let transcript = await this.transcriptDao.findOne({
				assignId: assign.id!,
				evaluationId: evaluation.id!,
				studentId: student.id!,
			});
			if (transcript) {
				// update grae
				transcript.update({ grade: transcriptDetail.grade });
				transcript = await this.transcriptDao.updateEntity(transcript);
			} else {
				// update grae
				transcript = await this.transcriptDao.insertEntity(
					Transcript.create({
						assign,
						evaluation,
						grade: transcriptDetail.grade,
						student: student,
					})
				);
			}

			transcripts.push(transcript);
		}
		return transcripts.map(e => e.toJSON);
	}
}
