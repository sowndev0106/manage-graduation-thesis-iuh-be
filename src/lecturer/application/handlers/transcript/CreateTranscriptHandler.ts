import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Assign from '@core/domain/entities/Assign';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import Group from '@core/domain/entities/Group';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import TranscriptDetails, { ITranscriptDetail } from '@core/domain/validate-objects/TranscriptDetails';
import Student from '@core/domain/entities/Student';
import Lecturer from '@core/domain/entities/Lecturer';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Term from '@core/domain/entities/Term';

interface ValidatedInput {
	lecturer: Lecturer;
	student: Student;
	term: Term;
	transcriptDetails: ITranscriptDetail[];
}
@injectable()
export default class CreateTranscriptHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('AssignDao') private assignDao!: IAssignDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.body['lecturerId'] }));
		const groupLecturerId = this.errorCollector.collect('groupLecturerId', () => EntityId.validate({ value: request.body['groupLecturerId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const transcriptDetails = this.errorCollector.collect('transcriptDetails', () =>
			TranscriptDetails.validate({ value: request.body['transcriptDetails'] })
		);
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError(' student not found');

		let lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) throw new NotFoundError('lecturer not found');

		let term = await this.termDao.findEntityById(1);
		if (!term) throw new NotFoundError('term not found');

		return {
			student,
			lecturer,
			transcriptDetails,
			term,
		};
	}

	async handle(request: Request) {
		const { student, lecturer, transcriptDetails, term } = await this.validate(request);

		// const groupLecturer = await this.groupLecturerDao.findOne(term.id);
		// const assign = await this.assignDao.findOne()
		return student?.toJSON;
	}
}
