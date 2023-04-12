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
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';

interface ValidatedInput {
	id: number;
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
	isPublicDate: boolean;
}
@injectable()
export default class UpdateTermHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const isPublicDate = this.errorCollector.collect('isPublicDate', () => BooleanValidate.validate({ value: request.body['isPublicDate'] }));
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
		if (startDateSubmitTopic >= endDateSubmitTopic) throw new Error('startDateSubmitTopic must be better endDateSubmitTopic');
		if (startDateChooseTopic >= endDateChooseTopic) throw new Error('startDateChooseTopic must be better endDateChooseTopic');

		return {
			id,
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
			isPublicDate,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let majors = await this.majorsDao.findEntityById(input.majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		let term = await this.termDao.findEntityById(input.id);
		if (!term) throw new Error('term not found');

		let termsByYear = await this.termDao.findByYearAndMajors(input.majorsId, input.startDate.getFullYear(), input.endDate.getFullYear());

		let termCheckName = termsByYear.find(e => e.name == input.name);

		if (termCheckName?.id && termCheckName.id != term.id)
			throw new Error(`name already exists in majors and year ${input.startDate.getFullYear()} - ${input.endDate.getFullYear()}`);

		term = await this.termDao.updateEntity(
			Term.create(
				{
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
				},
				input.id
			)
		);
		if (!term) throw new Error('Create term fail');

		return term.toJSON;
	}
}
