import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ITermDao from '@student/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Group from '@core/domain/entities/Group';
import GroupMember from '@core/domain/entities/GroupMember';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@student/domain/daos/IStudentDao';

interface ValidatedInput {
	name: string;
	topicId: number;
	termId: number;
	studentId: number;
}
@injectable()
export default class CreateGroupHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const topicId = this.errorCollector.collect('topicId', () => EntityId.validate({ value: request.body['topicId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			name,
			topicId,
			termId,
			studentId,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let term = await this.termDao.findEntityById(input.termId);
		if (!term) throw new NotFoundError('term not found');

		let group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (group) throw new Error('group already exists in student');

		group = await this.groupDao.insertEntity(
			Group.create({
				term: term,
				name: input.name,
			})
		);
		const student = await this.studentDao.findEntityById(input.studentId);
		// add member is yoursefl
		const member = GroupMember.create({ group: Group.createById(group.id), student: student! });
		await this.groupMemberDao.insertEntity(member);

		group.updateMembers([member]);

		return group?.toJSON;
	}
}
