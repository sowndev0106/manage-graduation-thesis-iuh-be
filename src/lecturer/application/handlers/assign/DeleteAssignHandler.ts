import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Term from '@core/domain/entities/Term';
import Assign from '@core/domain/entities/Assign';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	assign: Assign;
}

@injectable()
export default class DeleteAssignHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		const assign = await this.assignDao.findEntityById(id);
		if (!assign) throw new NotFoundError('assign not found');

		return { assign };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let result = await this.assignDao.deleteEntity(input.assign);

		return result ? 'Delete Assign success' : 'Delete Assign fail';
	}
}
