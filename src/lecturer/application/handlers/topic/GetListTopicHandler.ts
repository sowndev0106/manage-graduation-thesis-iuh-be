import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';

interface ValidatedInput {
	termId: number;
	lecturerId: number;
}

@injectable()
export default class GetListTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: false }));
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.query['lecturerId'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, lecturerId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const listTopic = await this.topicDao.findAll(input.termId, input.lecturerId);

		const resultPromise = listTopic.map(async topic => {
			const lecturer = await this.lecturerDao.findGraphEntityById(topic.lecturerId!, 'user');
			lecturer && topic.updateLecturer(lecturer);
			return topic;
		});

		const reponse = await Promise.all(resultPromise);

		return reponse.map(e => e.toJSON);
	}
}
