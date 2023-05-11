import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Topic, { TypeStatusTopic } from '@core/domain/entities/Topic';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
import Lecturer from '@core/domain/entities/Lecturer';
import Term from '@core/domain/entities/Term';
import StatusTopic from '@core/domain/validate-objects/StatusTopic';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import ErrorCode from '@core/domain/errors/ErrorCode';
import ForbiddenError from '@core/domain/errors/ForbiddenError';

interface ValidatedInput {
	id: number;
	name: string;
	quantityGroupMax: number;
	description: string;
	note?: string;
	target: string;
	standradOutput: string;
	requireInput: string;
	comment?: string;
	term: Term;
	lecturerTerm: LecturerTerm;
}
@injectable()
export default class UpdateTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const quantityGroupMax = this.errorCollector.collect('quantityGroupMax', () => PositiveNumber.validate({ value: request.body['quantityGroupMax'] }));
		const description = this.errorCollector.collect('description', () => Text.validate({ value: request.body['description'] }));
		const note = this.errorCollector.collect('note', () => SortText.validate({ value: request.body['note'], required: false }));
		const target = this.errorCollector.collect('target', () => SortText.validate({ value: request.body['target'] }));
		const standradOutput = this.errorCollector.collect('standradOutput', () => SortText.validate({ value: request.body['standradOutput'] }));
		const requireInput = this.errorCollector.collect('requireInput', () => SortText.validate({ value: request.body['requireInput'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new NotFoundError('Term not found');
		}

		const lecturerTerm = await this.lecturerTermDao.findOne(termId, lecturerId);

		if (!lecturerTerm) {
			throw new ErrorCode('LECTURER_NOT_IN_TERM', `lecturer not in term ${termId}`);
		}
		return {
			id,
			name,
			quantityGroupMax,
			description,
			note,
			target,
			standradOutput,
			requireInput,
			term,
			lecturerTerm,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let topic = await this.topicDao.findEntityById(input.id);
		if (!topic) throw new NotFoundError('Topic not found');

		if (topic.lecturerTermId != input.lecturerTerm.id) {
			throw new ForbiddenError("You doesn't permission to this topic");
		}

		const topicByName = await this.topicDao.findOne({
			lecturerTermId: input.lecturerTerm.id!,
			name: input.name,
		});
		if (topicByName?.id && topicByName?.id != input.id) {
			throw new ErrorCode('TOPIC_DUPLICATE_NAME', 'name already exists');
		}

		topic.update({
			name: input.name,
			quantityGroupMax: input.quantityGroupMax,
			description: input.description,
			note: input.note,
			target: input.target,
			standradOutput: input.standradOutput,
			requireInput: input.requireInput,
			status: TypeStatusTopic.PEDING,
		});

		topic = await this.topicDao.updateEntity(topic);

		if (!topic) throw new ErrorCode('FAIL_CREATE_ENTITY', 'Create Topic fail');

		return topic.toJSON;
	}
}
