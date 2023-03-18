import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ValidationError from '@core/domain/errors/ValidationError';
import ITopicDao from '@student/domain/daos/ITopicDao';
import Topic from '@core/domain/entities/Topic';
import Group from '@core/domain/entities/Group';
import ITermDao from '@student/domain/daos/ITermDao';

interface ValidatedInput {
	group: Group;
	topic: Topic;
}
@injectable()
export default class ChooseTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const topicId = this.errorCollector.collect('topicId', () => EntityId.validate({ value: request.body['topicId'] }));
		const termId = this.errorCollector.collect('termId ', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = Number(request.headers['id']);
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let topic = await this.topicDao.findEntityById(topicId);
		if (!topic) throw new NotFoundError('topic not found');

		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		let group = await this.groupDao.findOneByTermAndStudent(term.id!, studentId);
		if (!group) throw new NotFoundError('You not have group');

		if (group.topicId) {
			throw new Error('your group already have a topic');
		}
		return {
			topic,
			group,
		};
	}

	async handle(request: Request) {
		const { topic, group } = await this.validate(request);
		const groups = await this.groupDao.findAll(undefined, topic.id);

		if (topic.quantityGroupMax <= groups.length) {
			throw new Error('max quality topic');
		}

		group.update({ topic });

		const groupNew = await this.groupDao.updateEntity(group);

		return groupNew.toJSON;
	}
}
