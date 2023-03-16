import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import { TypeStatusTopic } from '@core/domain/entities/Topic';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
import Lecturer from '@core/domain/entities/Lecturer';
import Term from '@core/domain/entities/Term';
import StatusTopic from '@core/domain/validate-objects/StatusTopic';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';

interface ValidatedInput {
	id: number;
	comment: string;
	status: TypeStatusTopic;
	lecturerId: number;
}
@injectable()
export default class UpdateStatusAndCommentTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const status = this.errorCollector.collect('status', () => StatusTopic.validate({ value: request.body['status'] }));
		const comment = this.errorCollector.collect('comment', () => SortText.validate({ value: request.body['comment'], required: false }));
		const lecturerId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			id,
			status,
			comment,
			lecturerId,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let topic = await this.topicDao.findEntityById(input.id);
		if (!topic) throw new Error('Topic not found');

		// check is head lecture this majors of topic
		const term = await this.termDao.findEntityById(topic.termId!);
		const lecturer = await this.lecturerDao.findEntityById(input.lecturerId);

		// check headlecturer of majors
		// head lecturer only handler in my majors
		// if (lecturer?.headLecturerId != lecturerTopic?.id) {
		// 	throw new Error(`You doesn't permission for majors: ${majorsTopic?.name}`);
		// }

		topic.update({
			comment: input.comment,
			status: input.status,
		});

		topic = await this.topicDao.updateEntity(topic);

		if (!topic) throw new Error('update status Topic fail');

		return topic.toJSON;
	}
}
