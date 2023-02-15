import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@lecturer/domain/daos/ITermDao';

interface ValidatedInput {}

@injectable()
export default class GetListTermHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const terms = await this.termDao.getAllEntities();

		return terms.map(e => e.toJSON);
	}
}
