import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ITermDao from '@student/domain/daos/ITermDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import Student from '@core/domain/entities/Student';
import SortText from '@core/domain/validate-objects/SortText';
import Group from '@core/domain/entities/Group';
import GroupMember from '@core/domain/entities/GroupMember';

interface ValidatedInput {
	groupId: number;
	studentId: number;
	message?: string;
}

@injectable()
export default class SendRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.params['id'] }));
		const message = this.errorCollector.collect('message', () => SortText.validate({ value: request.body['message'], required: false }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { groupId, studentId, message };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findEntityById(input.groupId);
		if (!group) throw new Error('group not found');

		const groupExist = await this.groupDao.findOneByTermAndStudent(group.termId!, input.studentId);
		if (groupExist) throw new Error('You already have a group');

		const groupStudentInvite = await this.groupDao.findOneByTermAndStudent(group.termId!, input.studentId);
		if (groupStudentInvite) throw new Error('student already exists group in termId');

		// check exist
		let requestJoinGroup = await this.requestJoinGroupDao.findByGroupIdAndStudentId(group.id!, input.studentId!);
		if (requestJoinGroup) {
			requestJoinGroup = await this.handleExistingRequestJoin(requestJoinGroup, input, group);
		} else {
			requestJoinGroup = await this.handleNewRequestJoin(input, group, Student.createById(input.studentId));
		}

		return requestJoinGroup.toJSON;
	}
	private async handleNewRequestJoin(input: ValidatedInput, group: Group, student: Student) {
		const requestJoinGroup = RequestJoinGroup.create({
			group,
			student,
			message: input.message,
			type: TypeRequestJoinGroup.REQUEST_JOIN,
		});

		return this.requestJoinGroupDao.insertEntity(requestJoinGroup);
	}
	private async handleExistingRequestJoin(requestJoinGroup: RequestJoinGroup, input: ValidatedInput, group: Group) {
		if (requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_INVITE) {
			await this.requestJoinGroupDao.deleteEntity(requestJoinGroup);
			await this.groupMemberDao.insertEntity(GroupMember.create({ group, student: requestJoinGroup.student }));
		} else if (input.message) {
			requestJoinGroup.updateMessage(input.message);
			await this.requestJoinGroupDao.updateEntity(requestJoinGroup);
		}
		return requestJoinGroup;
	}
}
