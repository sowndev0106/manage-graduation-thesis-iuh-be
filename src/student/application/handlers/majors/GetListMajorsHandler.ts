import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IMajorsDao from '@student/domain/daos/IMajorsDao';

interface ValidatedInput {}

@injectable()
export default class GetListTermHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const terms = await this.majorsDao.getAllEntities();

		return terms.map(e => e.toJSON);
	}
}
