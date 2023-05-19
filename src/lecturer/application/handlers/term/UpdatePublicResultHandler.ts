import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';

interface ValidatedInput {
	id: number;
	isPublicResult: boolean;
}
@injectable()
export default class UpdatePublicResultHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));
		const isPublicResult = this.errorCollector.collect('isPublicResult', () => BooleanValidate.validate({ value: request.body['isPublicResult'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		return { id, isPublicResult };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let term = await this.termDao.findEntityById(input.id);
		if (!term) throw new NotFoundError('term not found');

		term.update({ isPublicResult: input.isPublicResult });
		await this.termDao.updateEntity(term);

		return term.toJSON;
	}
}
