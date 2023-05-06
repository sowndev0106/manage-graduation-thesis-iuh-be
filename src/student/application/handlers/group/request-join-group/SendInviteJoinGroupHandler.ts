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
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import ITermDao from '@student/domain/daos/ITermDao';
import Term from '@core/domain/entities/Term';
import StudentTerm from '@core/domain/entities/StudentTerm';

interface ValidatedInput {
	term: Term;
	studentTerm: StudentTerm;
	studentTermInvite: StudentTerm;
	message?: string;
}

@injectable()
export default class SendInviteJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentInviteId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const message = this.errorCollector.collect('message', () => SortText.validate({ value: request.body['message'], required: false }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new Error('term not found');
		}
		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${termId}`);
		}

		const student = await this.studentDao.findEntityById(studentInviteId);
		if (!student) throw new Error('Student invite not found');

		const studentTermInvite = await this.studentTermDao.findOne(termId, studentInviteId);
		if (!studentTermInvite) {
			throw new Error(`student invite not in term ${termId}`);
		}
		return { term, studentTerm, message, studentTermInvite };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findOne({
			studentTermId: input.studentTerm.id!,
		});
		if (!group) throw new Error("You don't have a group");

		const groupStudentInvite = await this.groupDao.findOne({ studentTermId: input.studentTermInvite.id! });
		if (groupStudentInvite) throw new Error(`student already exists group in ${input.term.id}`);

		// check exist
		let requestJoinGroup = await this.requestJoinGroupDao.findOneByGroupIdAndStudentTermId({ groupId: group.id!, studentTermId: input.studentTerm.id! });
		if (requestJoinGroup) {
			requestJoinGroup = await this.handleExistingRequestJoin(requestJoinGroup, input, group);
		} else {
			requestJoinGroup = await this.handleNewRequestJoin(input, group);
		}

		return requestJoinGroup?.toJSON;
	}
	private async handleNewRequestJoin(input: ValidatedInput, group: Group) {
		const requestJoinGroup = RequestJoinGroup.create({
			group,
			studentTerm: input.studentTermInvite,
			message: input.message,
			type: TypeRequestJoinGroup.REQUEST_INVITE,
		});

		return this.requestJoinGroupDao.insertEntity(requestJoinGroup);
	}
	private async handleExistingRequestJoin(requestJoinGroup: RequestJoinGroup, input: ValidatedInput, group: Group) {
		if (requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_JOIN) {
			await this.requestJoinGroupDao.deleteEntity(requestJoinGroup);
			await this.groupMemberDao.insertEntity(GroupMember.create({ group, studentTerm: requestJoinGroup.studentTerm }));
		} else if (input.message) {
			requestJoinGroup.update({ message: input.message });
			await this.requestJoinGroupDao.updateEntity(requestJoinGroup);
		}
		return requestJoinGroup;
	}
}
