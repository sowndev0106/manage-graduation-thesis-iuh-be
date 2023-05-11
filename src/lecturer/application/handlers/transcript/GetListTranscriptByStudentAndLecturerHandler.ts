import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ValidationError from '@core/domain/errors/ValidationError';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import Assign from '@core/domain/entities/Assign';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Transcript from '@core/domain/entities/Transcript';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import Group from '@core/domain/entities/Group';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	studentTerm: StudentTerm;
	lecturerTerm: LecturerTerm;
	typeEvaluation: TypeEvaluation;
	assign: Assign;
	group: Group;
}
@injectable()
export default class GetListTranscriptByStudentHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('TranscriptDao') private transcriptDao!: ITranscriptDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.params['studentId'] }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.query['groupId'] }));
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () => TypeEvaluationValidate.validate({ value: request.query['typeEvaluation'] }));
		let lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.query['lecturerId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		const group = await this.groupDao.findEntityById(groupId);
		if (!group) {
			throw new ErrorCode('STUDENT_DONT_HAVE_GROUP', 'Student do not have group');
		}
		let studentTerm = await this.studentTermDao.findOne(group?.termId!, studentId);
		if (!studentTerm) throw new NotFoundError('student Term not found');

		const groupMembertudents = await this.groupMemberDao.findOne({
			studentTermId: studentTerm.id!,
			groupId: group.id!,
		});
		if (!groupMembertudents) {
			throw new ErrorCode('STUDENT_NOT_IN_THIS_GROUP', `Student not in group ${group.id}`);
		}

		let lecturerTerm = await this.lecturerTermDao.findOne(group?.termId!, lecturerId);
		if (!lecturerTerm) throw new NotFoundError('lecturer Term not found');

		const assign = await this.assignDao.findOneExtends({
			lecturerTermId: lecturerTerm.id!,
			studentTermId: studentTerm.id!,
			typeEvaluation,
		});
		if (!assign) {
			throw new ErrorCode('LECTURER_DO_NOT_HAVE_ASSIGN', 'Lecturer do not have assign');
		}

		const groupMemberLecturer = await this.groupLecturerMemberDao.findOne({
			groupLecturerId: assign.groupLecturerId!,
			lecturerTermId: lecturerTerm.id!,
		});
		if (!groupMemberLecturer) {
			throw new ErrorCode('LECTURER_NOT_IN_THIS_GROUP', `Lecturer not in group ${assign.groupLecturerId}`);
		}

		return {
			typeEvaluation,
			lecturerTerm,
			studentTerm,
			assign,
			group,
		};
	}

	async handle(request: Request) {
		const { typeEvaluation, studentTerm, assign, group, lecturerTerm } = await this.validate(request);
		const groupLecturer = await this.groupLecturerDao.findEntityById(assign.groupLecturerId);
		const evaluations = await this.evaluationDao.findAll(groupLecturer?.termId, assign.typeEvaluation);

		const evaluationMap = new Map<number, Evaluation>();
		evaluations.forEach(evaluation => {
			evaluationMap.set(evaluation.id!, evaluation);
		});
		let transcripts = await this.transcriptDao.findAll({
			lecturerTermId: lecturerTerm.id!,
			studentTermId: studentTerm.id!,
		});
		const transcripMap = new Map<number, Transcript>();
		transcripts.forEach(e => {
			transcripMap.set(e.evaluationId!, e);
		});

		const evaluationTranscriptJSON = evaluations.map(evaluation => {
			const transcript = transcripMap.get(evaluation.id!);
			const props: any = evaluation.toJSON;
			let grade = 0;
			if (transcript) {
				grade = transcript.grade;
			}
			props.grade = grade;
			return props;
		});

		return evaluationTranscriptJSON;
	}
}
