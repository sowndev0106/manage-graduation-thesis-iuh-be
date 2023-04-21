import { id, inject, injectable } from 'inversify';
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
import { forIn } from 'lodash';

interface ValidatedInput {
	student: Student;
	term: Term;
}
interface IGraderByLecturer {
	lecturer: Lecturer;
	grade: number;
}
interface IGradeByTypeEluvation {
	avgGrader: number;
	sumGrade: number;
	count: number;
	details: IGraderByLecturer[];
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

		const gradeByType: Record<TypeEvaluation, IGradeByTypeEluvation> = {
			ADVISOR: {
				avgGrader: 0,
				sumGrade: 0,
				count: 0,
				details: [],
			},
			REVIEWER: {
				avgGrader: 0,
				sumGrade: 0,
				count: 0,
				details: [],
			},
			SESSION_HOST: {
				avgGrader: 0,
				sumGrade: 0,
				count: 0,
				details: [],
			},
		};

		gradeByType.ADVISOR = (await this.caculateAVGGrade(transcriptByType.ADVISOR)) || [];
		gradeByType.REVIEWER = (await this.caculateAVGGrade(transcriptByType.REVIEWER)) || [];
		gradeByType.SESSION_HOST = (await this.caculateAVGGrade(transcriptByType.SESSION_HOST)) || [];

		const missings = [];
		if (gradeByType.ADVISOR.details.length == 0) missings.push('ADVISOR');
		if (gradeByType.REVIEWER.details.length == 0) missings.push('REVIEWER');
		if (gradeByType.SESSION_HOST.details.length == 0) missings.push('SESSION_HOST');
		const avgGradeAdvisorReviewer =
			(gradeByType.REVIEWER.sumGrade + gradeByType.ADVISOR.sumGrade) / (gradeByType.REVIEWER.count + gradeByType.ADVISOR.count);
		return {
			student: student.toJSON,
			gradeSummary: (avgGradeAdvisorReviewer + gradeByType.SESSION_HOST.avgGrader) / 2,
			missings,
			ADVISOR: {
				avgGrader: gradeByType.ADVISOR.avgGrader,
				details: gradeByType.ADVISOR.details.map(e => {
					return {
						lecturer: e.lecturer.toJSON,
						grade: e.grade,
					};
				}),
			},
			REVIEWER: {
				avgGrader: gradeByType.REVIEWER.avgGrader,
				details: gradeByType.REVIEWER.details.map(e => {
					return {
						lecturer: e.lecturer.toJSON,
						grade: e.grade,
					};
				}),
			},
			SESSION_HOST: {
				avgGrader: gradeByType.SESSION_HOST.avgGrader,
				details: gradeByType.SESSION_HOST.details.map(e => {
					return {
						lecturer: e.lecturer.toJSON,
						grade: e.grade,
					};
				}),
			},
		};
	}
	async caculateAVGGrade(transcripts: Array<Transcript>): Promise<IGradeByTypeEluvation> {
		const gradeByLecturer = new Map<number, IGraderByLecturer>();
		let sumGrade = 0;
		for (const transcript of transcripts) {
			sumGrade += transcript.grade;
			const oldGrade = gradeByLecturer.get(transcript.lecturerId!);
			if (!oldGrade) {
				const lecturer = await this.lecturerDao.findEntityById(transcript.lecturerId);
				gradeByLecturer.set(transcript.lecturerId!, {
					grade: transcript.grade,
					lecturer: lecturer!,
				});
			} else {
				gradeByLecturer.set(transcript.lecturerId!, {
					grade: oldGrade.grade + transcript.grade,
					lecturer: oldGrade.lecturer,
				});
			}
		}
		const gradeByLecturers = Array.from(gradeByLecturer.values());
		return {
			avgGrader: sumGrade / gradeByLecturers.length,
			sumGrade: sumGrade,
			count: gradeByLecturers.length,
			details: gradeByLecturers,
		};
	}
}
