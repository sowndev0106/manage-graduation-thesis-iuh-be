import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	groupId: number;
}

@injectable()
export default class GetGroupByIdHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const groupId = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { groupId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findEntityById(input.groupId);

		if (!group) throw new NotFoundError('group not found');

		const members = await this.groupMemberDao.findByGroupId({ groupId: input.groupId });

		group.updateMembers(members);

		return group.toJSON;
	}
}
