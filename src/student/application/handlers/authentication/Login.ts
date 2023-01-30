import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Text from '@core/domain/validate-objects/SortText';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';

interface ValidatedInput {}

@injectable()
export default class LoginHandlers extends RequestHandler {
	async validate(request: Request): Promise<ValidatedInput> {
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return request;
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		return { status: 'ok' };
	}
}
