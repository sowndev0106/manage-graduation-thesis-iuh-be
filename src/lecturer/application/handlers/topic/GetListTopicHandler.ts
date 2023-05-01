import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';

interface ValidatedInput {
	termId: number;
	lecturerId: number;
}

@injectable()
export default class GetListTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
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
		const props: any = { termId: input.termId };
		if (input.termId) {
			const lecturerTerm = await this.lecturerTermDao.findOne(input.termId, input.lecturerId);
			if (lecturerTerm) props.lecturerTermId = lecturerTerm?.id;
		}
		const listTopic = await this.topicDao.findAll(props);

		return listTopic.map(e => e.toJSON);
	}
}
