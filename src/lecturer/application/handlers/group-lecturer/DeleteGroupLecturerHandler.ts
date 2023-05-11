import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class DeleteGroupLecturerHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const groupLecturer = await this.groupLecturerDao.findEntityById(input.id);

		if (!groupLecturer) {
			throw new NotFoundError('groupLecturer not found');
		}

		const result = await this.groupLecturerDao.deleteEntity(groupLecturer);

		return result ? 'delete success' : 'delete fail';
	}
}
