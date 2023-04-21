import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ValidationError from '@core/domain/errors/ValidationError';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import Assign from '@core/domain/entities/Assign';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Transcript from '@core/domain/entities/Transcript';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import Lecturer from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import Group from '@core/domain/entities/Group';
import Term from '@core/domain/entities/Term';

interface ValidatedInput {
	student: Student;
	term: Term;
}
interface IGrade {
	status: 'missing' | 'ok';
	avg: number;
}
@injectable()
export default class GetAVGTranscriptHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('TranscriptDao') private transcriptDao!: ITranscriptDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.query['studentId'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		return {
			student,
			term,
		};
	}

	async handle(request: Request) {
		const { student, term } = await this.validate(request);

		const transcriptByType: Record<TypeEvaluation, Array<Transcript>> = {
			ADVISOR: [],
			REVIEWER: [],
			SESSION_HOST: [],
		};

		transcriptByType.ADVISOR = await this.transcriptDao.findByStudentAndType({
			termId: term.id!,
			studentId: student.id!,
			type: TypeEvaluation.ADVISOR,
		});
		transcriptByType.REVIEWER = await this.transcriptDao.findByStudentAndType({
			termId: term.id!,
			studentId: student.id!,
			type: TypeEvaluation.REVIEWER,
		});
		transcriptByType.SESSION_HOST = await this.transcriptDao.findByStudentAndType({
			termId: term.id!,
			studentId: student.id!,
			type: TypeEvaluation.SESSION_HOST,
		});

		const initValueGrade: IGrade = {
			status: 'missing',
			avg: 0,
		};
		const gradeByType: Record<TypeEvaluation, IGrade> = {
			ADVISOR: initValueGrade,
			REVIEWER: initValueGrade,
			SESSION_HOST: initValueGrade,
		};

		gradeByType.ADVISOR = this.caculateAVGGrade(transcriptByType.ADVISOR);
		gradeByType.REVIEWER = this.caculateAVGGrade(transcriptByType.REVIEWER);
		gradeByType.SESSION_HOST = this.caculateAVGGrade(transcriptByType.SESSION_HOST);

		return {
			grade: gradeByType,
		};
	}
	caculateAVGGrade(transcripts: Array<Transcript>): IGrade {
		// const sumWithInitial = transcripts.reduce((firstResult, currentValue) => accumulator + currentValue, {
		// 	sumGradeMax: 0,
		// 	sumGrade: 0,
		// });
		return null as any;
	}
}
