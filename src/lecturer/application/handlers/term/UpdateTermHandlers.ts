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
	dateDiscussion: Date;
	dateReport: Date;
}
@injectable()
export default class UpdateTermHandlers extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));
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

		const dateDiscussion = this.errorCollector.collect('dateDiscussion', () => DateValidate.validate({ value: request.body['dateDiscussion'] }));
		const dateReport = this.errorCollector.collect('dateReport', () => DateValidate.validate({ value: request.body['dateReport'] }));

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
			dateDiscussion,
			dateReport,
			startDateChooseTopic,
			endDateChooseTopic,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let majors = await this.majorsDao.findEntityById(input.majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		let term = await this.termDao.findEntityById(input.id);
		if (!term) throw new Error('term not found');

		let termCheck = await this.termDao.findByNameAndMajors(input.name, input.majorsId);

		if (termCheck?.id && termCheck.id != term.id) throw new Error('name already exists in majors');

		term = await this.termDao.updateEntity(
			Term.create(
				{
					name: input.name,
					majors: Majors.createById(input.majorsId),
					startDate: input.startDate,
					endDate: input.endDate,
					startDateSubmitTopic: input.startDateSubmitTopic,
					endDateSubmitTopic: input.endDateSubmitTopic,
					dateDiscussion: input.dateDiscussion,
					dateReport: input.dateReport,
					startDateChooseTopic: input.startDateChooseTopic,
					endDateChooseTopic: input.endDateChooseTopic,
					updatedAt: new Date(),
				},
				input.id
			)
		);
		if (!term) throw new Error('Create term fail');

		return term.toJSON;
	}
}