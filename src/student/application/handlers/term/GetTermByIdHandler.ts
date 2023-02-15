import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@student/domain/daos/ITermDao';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class GetTermByIdHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.termDao.findEntityById(input.id);

		if (!term) {
			throw new Error('term not found');
		}

		return term.toJSON;
	}
}
