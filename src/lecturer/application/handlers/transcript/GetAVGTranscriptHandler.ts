import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ValidationError from '@core/domain/errors/ValidationError';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Transcript from '@core/domain/entities/Transcript';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import Lecturer from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import Term from '@core/domain/entities/Term';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import StudentTerm from '@core/domain/entities/StudentTerm';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	studentTerm: StudentTerm;
}
interface IGraderByLecturerTerm {
	lecturerTerm: LecturerTerm;
	grade: number;
}
interface IGradeByTypeEluvation {
	avgGrader: number;
	sumGrade: number;
	count: number;
	details: IGraderByLecturerTerm[];
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
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;

	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
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
		const studentTerm = await this.studentTermDao.findOne(termId, studentId);

		if (!studentTerm) {
			throw new ErrorCode('STUDENT_NOT_IN_TERM', `student not in term ${termId}`);
		}
		return {
			studentTerm,
		};
	}

	async handle(request: Request) {
		const { studentTerm } = await this.validate(request);

		const transcriptByType: Record<TypeEvaluation, Array<Transcript>> = {
			ADVISOR: [],
			REVIEWER: [],
			SESSION_HOST: [],
		};

		transcriptByType.ADVISOR = await this.transcriptDao.findByStudentAndType({
			studentTermId: studentTerm.id!,
			type: TypeEvaluation.ADVISOR,
		});
		transcriptByType.REVIEWER = await this.transcriptDao.findByStudentAndType({
			studentTermId: studentTerm.id!,
			type: TypeEvaluation.REVIEWER,
		});
		transcriptByType.SESSION_HOST = await this.transcriptDao.findByStudentAndType({
			studentTermId: studentTerm.id!,
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
		let gradeSummary = (avgGradeAdvisorReviewer + gradeByType.SESSION_HOST.avgGrader) / 2;

		const achievements = await this.achievementDao.findAll({
			studentTermId: studentTerm.id!,
		});

		// add grade achievement
		gradeSummary += achievements.reduce((num, e) => e.bonusGrade + num, 0);

		return {
			student: studentTerm.toJSON,
			gradeSummary: gradeSummary > 10 ? 10 : gradeSummary,
			missings,
			achievements: achievements.map(achievement => achievement.toJSON),
			ADVISOR: {
				avgGrader: gradeByType.ADVISOR.avgGrader,
				details: gradeByType.ADVISOR.details.map(e => {
					return {
						lecturer: e.lecturerTerm.toJSON,
						grade: e.grade,
					};
				}),
			},
			REVIEWER: {
				avgGrader: gradeByType.REVIEWER.avgGrader,
				details: gradeByType.REVIEWER.details.map(e => {
					return {
						lecturer: e.lecturerTerm.toJSON,
						grade: e.grade,
					};
				}),
			},
			SESSION_HOST: {
				avgGrader: gradeByType.SESSION_HOST.avgGrader,
				details: gradeByType.SESSION_HOST.details.map(e => {
					return {
						lecturer: e.lecturerTerm.toJSON,
						grade: e.grade,
					};
				}),
			},
		};
	}
	async caculateAVGGrade(transcripts: Array<Transcript>): Promise<IGradeByTypeEluvation> {
		const gradeByLecturer = new Map<number, IGraderByLecturerTerm>();
		let sumGrade = 0;
		for (const transcript of transcripts) {
			sumGrade += transcript.grade;
			const oldGrade = gradeByLecturer.get(transcript.lecturerTermId!);
			if (!oldGrade) {
				const lecturerTerm = await this.lecturerTermDao.findEntityById(transcript.lecturerTermId);
				const lecturer = await this.lecturerDao.findEntityById(lecturerTerm?.lecturerId);
				lecturerTerm?.update({ lecturer: lecturer! });
				gradeByLecturer.set(transcript.lecturerTermId!, {
					grade: transcript.grade,
					lecturerTerm: lecturerTerm!,
				});
			} else {
				gradeByLecturer.set(transcript.lecturerTermId!, {
					grade: oldGrade.grade + transcript.grade,
					lecturerTerm: oldGrade.lecturerTerm,
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
