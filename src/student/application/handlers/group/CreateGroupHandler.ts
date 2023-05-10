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
import Group, { TypeStatusGroup } from '@core/domain/entities/Group';
import GroupMember from '@core/domain/entities/GroupMember';
import IStudentDao from '@student/domain/daos/IStudentDao';
import StudentTerm from '@core/domain/entities/StudentTerm';
import Term from '@core/domain/entities/Term';
import Topic from '@core/domain/entities/Topic';
import ITopicDao from '@student/domain/daos/ITopicDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';

interface ValidatedInput {
	name: string;
	topic?: Topic;
	term: Term;
	studentTerm: StudentTerm;
}
@injectable()
export default class CreateGroupHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const topicId = this.errorCollector.collect('topicId', () => EntityId.validate({ value: request.body['topicId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		let topic: any = undefined;
		if (topicId) {
			topic = await this.topicDao.findEntityById(topicId);
			if (!topic) throw new NotFoundError('topic not found');
		}
		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${termId}`);
		}

		return {
			name,
			topic,
			term,
			studentTerm,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let group = await this.groupDao.findOne({
			studentTermId: input.studentTerm.id!,
		});

		if (group) throw new Error('group already exists in student');

		group = await this.groupDao.insertEntity(
			Group.create({
				term: input.term,
				name: input.name,
				status: TypeStatusGroup.OPEN,
			})
		);
		// add member is yoursefl
		const member = GroupMember.create({ group: Group.createById(group.id), studentTerm: input.studentTerm });
		await this.groupMemberDao.insertEntity(member);

		group.updateMembers([member]);

		return group?.toJSON;
	}
}
