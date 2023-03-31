import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import GroupMember from '@core/domain/entities/GroupMember';
import Student from '@core/domain/entities/Student';
import IGroupDao from '@student/domain/daos/IGroupDao';

interface ValidatedInput {
	studentId: number;
	requestJoinGroup: RequestJoinGroup;
}

@injectable()
export default class accepRequestJoinGroupHandler extends RequestHandler {
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('GroupDao') private groupDao!: IGroupDao;

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
		let response: any;
		if (input.requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_INVITE) {
			await this.accepInviteHandler(input);
		} else {
			// REQUEST_JOIN
			await this.accepRequestJoinHandler(input);
		}
		await this.requestJoinGroupDao.deleteByStudent(input.requestJoinGroup.studentId!);

		const group = await this.groupDao.findEntityById(input.requestJoinGroup.groupId);
		if (!group) {
			throw new Error('Group have been deleted');
		}
		let groupMember = GroupMember.create({
			student: Student.createById(input.studentId),
			group: group,
		});

		groupMember = await this.groupMemberDao.insertEntity(groupMember);

		group.members?.push(groupMember);

		return groupMember.toJSON;
	}
	private async accepRequestJoinHandler(input: ValidatedInput) {
		// check valid
		const members = await this.groupMemberDao.findByGroupId(input.requestJoinGroup.groupId!);
		const me = members.find(e => e.studentId === input.studentId);
		if (!me) {
			throw new Error("Can't accep because You are not member in group");
		}
	}
	private async accepInviteHandler(input: ValidatedInput) {
		// check authorization
		if (input.studentId != input.requestJoinGroup.studentId) {
			throw new Error("Can't accep because You are not invited");
		}
	}
}
