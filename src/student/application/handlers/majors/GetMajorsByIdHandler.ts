import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class GetTermByIdHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const majors = await this.majorsDao.findEntityById(input.id);

		if (!majors) {
			throw new NotFoundError('majors not found');
		}

		return majors.toJSON;
	}
}
