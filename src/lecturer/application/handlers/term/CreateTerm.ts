import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Text from '@core/domain/validate-objects/Text';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import DateValidate from '@core/domain/validate-objects/DateValidate';

interface ValidatedInput {}
// majors: Majors;
// startDate: Date;
// endDate: Date;
// startDateSubmitTopic: Date;
// endDateSubmitTopic: Date;
// startDateChooseTopic: Date;
// endDateChooseTopic: Date;
// dateDiscussion: Date;
// dateReport: Date;
@injectable()
export default class Test extends RequestHandler {
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const majors = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		// const startDate = this.errorCollector.collect('startDate', () => DateValidate.validate({ value: request.body['startDate'] }));
		// const startDate = this.errorCollector.collect('startDate', () => DateValidate.validate({ value: request.body['startDate'] }));
		// const startDate = this.errorCollector.collect('startDate', () => DateValidate.validate({ value: request.body['startDate'] }));
		// const startDate = this.errorCollector.collect('startDate', () => DateValidate.validate({ value: request.body['startDate'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return request;
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		return 'test handler';
	}
}
