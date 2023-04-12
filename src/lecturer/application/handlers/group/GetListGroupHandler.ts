import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';

interface ValidatedInput {
	termId: number;
	topicId: number;
}

@injectable()
export default class GetListGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const topicId = this.errorCollector.collect('topicId', () => EntityId.validate({ value: request.query['topicId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { topicId, termId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const groups = await this.groupDao.findAll(input.termId, input.topicId);

		return groups.map(e => e.toJSON);
	}
}
