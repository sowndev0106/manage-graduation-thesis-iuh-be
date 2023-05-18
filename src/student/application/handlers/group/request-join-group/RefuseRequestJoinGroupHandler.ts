import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup from '@core/domain/entities/RequestJoinGroup';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import StudentTerm from '@core/domain/entities/StudentTerm';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import NotificationStudentService from '@core/service/NotificationStudentService';
import Group from '@core/domain/entities/Group';

interface ValidatedInput {
	studentTerm: StudentTerm;
	requestJoinGroup: RequestJoinGroup;
	group: Group;
}

@injectable()
export default class RefuseRequestJoinGroupHandler extends RequestHandler {
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('StudentDao') private studentDao!: IStudentDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let requestJoinGroup = await this.requestJoinGroupDao.findEntityById(id);
		if (!requestJoinGroup) throw new NotFoundError('request not found');

		const group = await this.groupDao.findEntityById(requestJoinGroup.groupId);
		if (!group) throw new Error('group have been deleted');

		const studentTerm = await this.studentTermDao.findOne(group.termId!, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${group.termId!}`);
		}
		return { requestJoinGroup, studentTerm, group };
	}
	async handle(request: Request) {
		const input = await this.validate(request);
		if (input.studentTerm.id != input.requestJoinGroup.studentTermId) {
			// member group delete request join group
			const members = await this.groupMemberDao.findByGroupId(input.requestJoinGroup.groupId!);
			const me = members.find(e => e.studentTermId === input.studentTerm.id);
			if (!me) {
				throw new Error("Can't refuse");
			}
			await this.notificationToUser(input.group, input.requestJoinGroup.studentTerm);
		}
		await this.notificationToGroup(input.group, input.requestJoinGroup.studentTerm);
		return (await this.requestJoinGroupDao.deleteEntity(input.requestJoinGroup)).toJSON;
	}
	async notificationToUser(group: Group, studentTerm: StudentTerm) {
		const student = await this.studentDao.findEntityById(studentTerm.studentId);
		await NotificationStudentService.send({
			user: student!,
			message: `Nhóm '${group.name}' đã từ chối yêu cầu tham gia nhóm của bạn`,
			type: 'REQUEST_JOIN_GROUP',
		});
	}
	async notificationToGroup(group: Group, studentTerm: StudentTerm) {
		const student = await this.studentDao.findEntityById(studentTerm.studentId);
		const members = await this.groupMemberDao.findByGroupId(group.id!);
		for (const member of members) {
			await NotificationStudentService.send({
				user: member.studentTerm!,
				message: `'${student?.name}' đã từ chối lời mời tham gia nhóm của bạn`,
				type: 'REQUEST_JOIN_GROUP',
			});
		}
	}
}
