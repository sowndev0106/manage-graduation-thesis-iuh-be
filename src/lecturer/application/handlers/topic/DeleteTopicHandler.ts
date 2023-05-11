import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class DeleteTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.topicDao.findEntityById(input.id);

		if (!term) {
			throw new NotFoundError('topic not found');
		}

		const result = await this.topicDao.deleteEntity(term);
		return result ? 'delete success' : 'delete fail';
	}
}
