import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	studentId: number;
	requestJoinGroup: RequestJoinGroup;
}

@injectable()
export default class accepRequestJoinGroupHandler extends RequestHandler {
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let requestJoinGroup = await this.requestJoinGroupDao.findEntityById(id);
		if (!requestJoinGroup) throw new NotFoundError('request not found');

		return { requestJoinGroup, studentId };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		if (input.requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_INVITE) {
			return await this.accepInviteHandler(input);
		} else {
			// REQUEST_JOIN
			return await this.accepRequestJoinHandler(input);
		}
	}
	private async accepRequestJoinHandler(input: ValidatedInput) {
		// check valid
		const members = await this.groupMemberDao.findByGroupId(input.requestJoinGroup.groupId!);
		const me = members.find(e => e.studentId === input.studentId);
		if (!me) {
			throw new Error("Can't accep because You are not member in group");
		}
		return await this.requestJoinGroupDao.deleteByStudent(input.studentId);
	}
	private async accepInviteHandler(input: ValidatedInput) {
		// check authorization
		if (input.studentId != input.requestJoinGroup.studentId) {
			throw new Error("Can't accep because You are not invited");
		}
		return await this.requestJoinGroupDao.deleteByStudent(input.studentId);
	}
}
