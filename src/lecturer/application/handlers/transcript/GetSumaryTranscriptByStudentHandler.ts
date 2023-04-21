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
import Term from '@core/domain/entities/Term';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import Group from '@core/domain/entities/Group';

interface ValidatedInput {
	student: Student;
	term: Term;
}
@injectable()
export default class GetListTranscriptByStudentHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('TranscriptDao') private transcriptDao!: ITranscriptDao;
	@inject('TermDao') private termDao!: ITermDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.params['studentId'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));

		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		return {
			student,
			term,
		};
	}

	async handle(request: Request) {
		const { student, term } = await this.validate(request);

		const transcript = await this.transcriptDao.findTranscriptByStudentAndTerm(student, term);
		const groupLecturer = await this.groupLecturerDao.findEntityById(assign.groupLecturerId);
		const evaluations = await this.evaluationDao.findAll(groupLecturer?.termId, assign.typeEvaluation);

		const evaluationMap = new Map<number, Evaluation>();
		evaluations.forEach(evaluation => {
			evaluationMap.set(evaluation.id!, evaluation);
		});
		let transcripts = await this.transcriptDao.findAll({
			termId: group.id!,
			lecturerId: lecturer.id!,
			studentId: student.id!,
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
