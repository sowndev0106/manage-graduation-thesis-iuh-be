import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';

interface ValidatedInput {}

@injectable()
export default class Test extends RequestHandler {
	async validate(request: Request): Promise<ValidatedInput> {
		
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		
		return request;
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		return "test handler";
	}
}
