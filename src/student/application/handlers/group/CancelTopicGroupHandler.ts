import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupDao from '@student/domain/daos/IGroupDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Group from '@core/domain/entities/Group';
import ITermDao from '@student/domain/daos/ITermDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import ITopicDao from '@student/domain/daos/ITopicDao';
import IAssignDao from '@student/domain/daos/IAssignDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import IGroupLecturerDao from '@student/domain/daos/IGroupLecturerDao';
import IGroupLecturerMemberDao from '@student/domain/daos/IGroupLecturerMemberDao';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

interface ValidatedInput {
	group: Group;
}
@injectable()
export default class CancelTopicGroupHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId ', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${termId}`);
		}
		let group = await this.groupDao.findOne({
			studentTermId: studentTerm.id!,
		});
		if (!group) throw new NotFoundError('You not have group');

		return {
			group,
		};
	}

	async handle(request: Request) {
		const { group } = await this.validate(request);

		group.update({ topic: undefined });

		const groupNew = await this.groupDao.updateEntity(group);
		await this.updateAssignForLecturerOfTopic({ group });
		return groupNew.toJSON;
	}
	async updateAssignForLecturerOfTopic({ group }: ValidatedInput) {
		// autho delete assign advisor for lecturer of topic
		const assign = await this.assignDao.findOne({ groupId: group.id, type: TypeEvaluation.ADVISOR });
		if (assign) await this.assignDao.deleteEntity(assign);
	}
}
