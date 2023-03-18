import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import SortText from '@core/domain/validate-objects/SortText';
import IStudentDao from '@student/domain/daos/IStudentDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import GroupMember from '@core/domain/entities/GroupMember';
import Group from '@core/domain/entities/Group';
import Student from '@core/domain/entities/Student';

interface ValidatedInput {
	termId: number;
	studentId: number;
	studentInviteId: number;
	message?: string;
}

@injectable()
export default class SendInviteJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentInviteId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const message = this.errorCollector.collect('message', () => SortText.validate({ value: request.body['message'], required: false }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId, message, studentInviteId };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (!group) throw new Error("You don't have a group");

		const student = await this.studentDao.findEntityById(input.studentInviteId);
		if (!student) throw new Error('Student not found');

		const groupStudentInvite = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentInviteId);
		if (groupStudentInvite) throw new Error('student already exists group in termId');

		// check exist
		let requestJoinGroup = await this.requestJoinGroupDao.findByGroupIdAndStudentId(group.id!, student.id!);
		if (requestJoinGroup) {
			requestJoinGroup = await this.handleExistingRequestJoin(requestJoinGroup, input, group);
		} else {
			requestJoinGroup = await this.handleNewRequestJoin(input, group, student);
		}

		return requestJoinGroup?.toJSON;
	}
	private async handleNewRequestJoin(input: ValidatedInput, group: Group, student: Student) {
		const requestJoinGroup = RequestJoinGroup.create({
			group,
			student,
			message: input.message,
			type: TypeRequestJoinGroup.REQUEST_INVITE,
		});

		return this.requestJoinGroupDao.insertEntity(requestJoinGroup);
	}
	private async handleExistingRequestJoin(requestJoinGroup: RequestJoinGroup, input: ValidatedInput, group: Group) {
		if (requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_JOIN) {
			await this.requestJoinGroupDao.deleteEntity(requestJoinGroup);
			await this.groupMemberDao.insertEntity(GroupMember.create({ group, student: requestJoinGroup.student }));
		} else if (input.message) {
			requestJoinGroup.updateMessage(input.message);
			await this.requestJoinGroupDao.updateEntity(requestJoinGroup);
		}
		return requestJoinGroup;
	}
}
