import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';

interface ValidatedInput {
	majorsId: number;
	fromYear?: number;
	toYear?: number;
}

@injectable()
export default class GetListTermHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: String(request.query['majorsId']) }));
		const fromYear = this.errorCollector.collect('fromYear', () => PositiveNumber.validate({ value: request.query['fromYear'], required: false }));
		const toYear = this.errorCollector.collect('toYear', () => PositiveNumber.validate({ value: request.query['toYear'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		if (fromYear && toYear && toYear < fromYear) {
			throw new Error('fromYear must be bigger toYear');
		}

		return { majorsId, fromYear, toYear };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const terms = await this.termDao.findByYearAndMajors(input.majorsId, input.fromYear, input.toYear);

		return terms.map(e => e.toJSON);
	}
}
