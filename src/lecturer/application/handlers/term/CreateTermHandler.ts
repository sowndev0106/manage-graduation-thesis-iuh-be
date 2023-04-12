import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import DateValidate from '@core/domain/validate-objects/DateValidate';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Term from '@core/domain/entities/Term';
import Majors from '@core/domain/entities/Majors';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import ILecturerDao from '@student/domain/daos/ILecturerDao';
import { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import LecturerTerm from '@core/domain/entities/LecturerTerm';

interface ValidatedInput {
	name: string;
	majorsId: number;
	startDate: Date;
	endDate: Date;
	startDateSubmitTopic: Date;
	endDateSubmitTopic: Date;
	startDateChooseTopic: Date;
	endDateChooseTopic: Date;
	startDateDiscussion: Date;
	endDateDiscussion: Date;
	startDateReport: Date;
	endDateReport: Date;
}
@injectable()
export default class CreateTermHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('TermDao') private termDao!: ITermDao;

	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const startDate: Date = this.errorCollector.collect('startDate', () => DateValidate.validate({ value: request.body['startDate'] }));
		const endDate: Date = this.errorCollector.collect('endDate', () => DateValidate.validate({ value: request.body['endDate'] }));
		const startDateSubmitTopic: Date = this.errorCollector.collect('startDateSubmitTopic', () =>
			DateValidate.validate({ value: request.body['startDateSubmitTopic'] })
		);
		const endDateSubmitTopic: Date = this.errorCollector.collect('endDateSubmitTopic', () =>
			DateValidate.validate({ value: request.body['endDateSubmitTopic'] })
		);
		const startDateChooseTopic: Date = this.errorCollector.collect('startDateChooseTopic', () =>
			DateValidate.validate({ value: request.body['startDateChooseTopic'] })
		);
		const endDateChooseTopic: Date = this.errorCollector.collect('endDateChooseTopic', () =>
			DateValidate.validate({ value: request.body['endDateChooseTopic'] })
		);
		const endDateDiscussion: Date = this.errorCollector.collect('endDateDiscussion', () =>
			DateValidate.validate({ value: request.body['endDateDiscussion'] })
		);
		const startDateDiscussion: Date = this.errorCollector.collect('startDateDiscussion', () =>
			DateValidate.validate({ value: request.body['startDateDiscussion'] })
		);
		const endDateReport: Date = this.errorCollector.collect('endDateReport', () => DateValidate.validate({ value: request.body['endDateReport'] }));
		const startDateReport: Date = this.errorCollector.collect('startDateReport', () => DateValidate.validate({ value: request.body['startDateReport'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		if (startDate >= endDate) throw new Error('startDate must be better endDate');
		if (startDateSubmitTopic > endDateSubmitTopic) throw new Error('startDateSubmitTopic must be better endDateSubmitTopic');
		if (startDateChooseTopic > endDateChooseTopic) throw new Error('startDateChooseTopic must be better endDateChooseTopic');
		if (startDateDiscussion > endDateDiscussion) throw new Error('startDateDiscussion must be better endDateDiscussion');
		if (startDateReport > endDateReport) throw new Error('startDateReport must be better endDateReport');

		return {
			name,
			majorsId,
			startDate,
			endDate,
			startDateSubmitTopic,
			endDateSubmitTopic,
			startDateDiscussion,
			endDateDiscussion,
			startDateReport,
			endDateReport,
			startDateChooseTopic,
			endDateChooseTopic,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		let majors = await this.majorsDao.findEntityById(input.majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		let termsByYear = await this.termDao.findByYearAndMajors(input.majorsId, input.startDate.getFullYear(), input.endDate.getFullYear());

		let term = termsByYear.find(e => e.name == input.name);

		if (term) throw new Error(`name already exists in majors and year ${input.startDate.getFullYear()} - ${input.endDate.getFullYear()}`);

		term = await this.termDao.insertEntity(
			Term.create({
				name: input.name,
				majors: Majors.createById(input.majorsId),
				startDate: input.startDate,
				endDate: input.endDate,
				startDateSubmitTopic: input.startDateSubmitTopic,
				endDateSubmitTopic: input.endDateSubmitTopic,
				startDateDiscussion: input.startDateDiscussion,
				endDateDiscussion: input.endDateDiscussion,
				startDateReport: input.startDateReport,
				endDateReport: input.endDateReport,
				startDateChooseTopic: input.startDateChooseTopic,
				endDateChooseTopic: input.endDateChooseTopic,
				isPublicResult: false,
			})
		);

		if (!term) throw new Error('Create term fail');

		const headlectuers = await this.lecturerDao.findAll(undefined, undefined, TypeRoleLecturer.HEAD_LECTURER);
		const subHeadlectuers = await this.lecturerDao.findAll(undefined, undefined, TypeRoleLecturer.SUB_HEAD_LECTURER);
		const lecturers = [...headlectuers, ...subHeadlectuers];

		/// insert head lecturer and sub headlectuer in term
		lecturers.forEach(async lecturer => {
			await this.lecturerTermDao.insertEntity(
				LecturerTerm.create({
					lecturer,
					term: term!,
					role: lecturer.role,
				})
			);
		});

		return term.toJSON;
	}
}
