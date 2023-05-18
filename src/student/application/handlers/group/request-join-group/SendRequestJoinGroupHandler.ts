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
import StudentTerm from '@core/domain/entities/StudentTerm';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import NotificationStudentService from '@core/service/NotificationStudentService';

interface ValidatedInput {
	group: Group;
	studentTerm: StudentTerm;
	message?: string;
}

@injectable()
export default class SendRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.params['id'] }));
		const message = this.errorCollector.collect('message', () => SortText.validate({ value: request.body['message'], required: false }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		const group = await this.groupDao.findEntityById(groupId);
		if (!group) throw new Error('group not found');

		const student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new Error('Student  not found');

		const studentTerm = await this.studentTermDao.findOne(group.termId!, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${group.termId}`);
		}
		studentTerm.update({ student });
		return { group, studentTerm, message };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const groupExist = await this.groupDao.findOne({
			studentTermId: input.studentTerm.id!,
		});
		if (groupExist) throw new Error('You already have a group');

		// check exist
		let requestJoinGroup = await this.requestJoinGroupDao.findOneByGroupIdAndStudentTermId({
			groupId: input.group.id!,
			studentTermId: input.studentTerm.id!,
		});
		if (requestJoinGroup) {
			requestJoinGroup = await this.handleExistingRequestJoin(requestJoinGroup, input);
		} else {
			requestJoinGroup = await this.handleNewRequestJoin(input);
		}
		requestJoinGroup.update({ studentTerm: input.studentTerm });
		await this.notificationToGroup(input.group, input.studentTerm);
		return requestJoinGroup.toJSON;
	}
	private async handleNewRequestJoin(input: ValidatedInput) {
		const requestJoinGroup = RequestJoinGroup.create({
			group: input.group,
			studentTerm: input.studentTerm,
			message: input.message,
			type: TypeRequestJoinGroup.REQUEST_JOIN,
		});

		return this.requestJoinGroupDao.insertEntity(requestJoinGroup);
	}
	private async handleExistingRequestJoin(requestJoinGroup: RequestJoinGroup, input: ValidatedInput) {
		if (requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_INVITE) {
			await this.requestJoinGroupDao.deleteEntity(requestJoinGroup);
			await this.groupMemberDao.insertEntity(GroupMember.create({ group: input.group, studentTerm: requestJoinGroup.studentTerm }));
		} else if (input.message) {
			requestJoinGroup.update({ message: input.message });
			await this.requestJoinGroupDao.updateEntity(requestJoinGroup);
		}
		return requestJoinGroup;
	}
	async notificationToGroup(group: Group, studentTerm: StudentTerm) {
		const student = await this.studentDao.findEntityById(studentTerm.studentId);
		const members = await this.groupMemberDao.findByGroupId(group.id!);
		for (const member of members) {
			await NotificationStudentService.send({
				user: member.studentTerm!,
				message: `'${student?.name}' đã gửi yêu cầu tham gia nhóm`,
				type: 'REQUEST_JOIN_GROUP',
			});
		}
	}
}
