import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Text from '@core/domain/value-objects/Text';

interface ValidatedInput {}

@injectable()
export default class LoginHandlers extends RequestHandler {
	async validate(request: Request): Promise<ValidatedInput> {
		
		const code = this.errorCollector.collect("code",()=>Text.validate({value:request.body["code"]}))
		const password = this.errorCollector.collect("password",()=>Text.validate({value:request.body["password"]}))
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		
		return request;
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		return {status:"ok"};
	}
}
