import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ValidationError from '@core/domain/errors/ValidationError';
import ITopicDao from '@student/domain/daos/ITopicDao';
import Topic from '@core/domain/entities/Topic';
import Group from '@core/domain/entities/Group';
import ITermDao from '@student/domain/daos/ITermDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import ErrorCode from '@core/domain/errors/ErrorCode';
import IAssignDao from '@student/domain/daos/IAssignDao';
import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@student/domain/daos/IGroupLecturerDao';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import Term from '@core/domain/entities/Term';
import IGroupLecturerMemberDao from '@student/domain/daos/IGroupLecturerMemberDao';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import NotificationStudentService from '@core/service/NotificationStudentService';
import NotificationLecturerService from '@core/service/NotificationLecturerService';

interface ValidatedInput {
	group: Group;
	topic: Topic;
}
@injectable()
export default class ChooseTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const topicId = this.errorCollector.collect('topicId', () => EntityId.validate({ value: request.body['topicId'] }));
		const termId = this.errorCollector.collect('termId ', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = Number(request.headers['id']);
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let topic = await this.topicDao.findEntityById(topicId);
		if (!topic) throw new NotFoundError('topic not found');

		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new ErrorCode('STUDENT_NOT_IN_TERM', `student not in term ${termId}`);
		}
		let group = await this.groupDao.findOne({
			studentTermId: studentTerm.id!,
		});
		if (!group) throw new ErrorCode('STUDENT_DONT_HAVE_GROUP', 'You not have group');

		if (group.topicId) {
			throw new ErrorCode('GROUP_ALREADY_EXIST_TOPIC', 'your group already have a topic');
		}
		return {
			topic,
			group,
		};
	}

	async handle(request: Request) {
		const { topic, group } = await this.validate(request);
		const groups = await this.groupDao.findAll({ topicId: topic.id });

		if (topic.quantityGroupMax <= groups.length) {
			throw new ErrorCode('GROUP_MAX_QUALITY', 'max quality topic');
		}

		group.update({ topic });

		const groupNew = await this.groupDao.updateEntity(group);
		await this.updateAssignForLecturerOfTopic({ topic, group: groupNew });
		await this.notification(topic, group);
		return groupNew.toJSON;
	}
	async notification(topic: Topic, group: Group) {
		const members = await this.groupMemberDao.findByGroupId(group.id!);
		for (const member of members) {
			await NotificationStudentService.send({
				user: member.studentTerm!,
				message: `Chọn đề tài '${topic.name}' thành công`,
				type: 'CHOOSE_TOPIC',
			});
		}
		await NotificationLecturerService.send({
			user: topic.lecturerTerm!,
			message: `Nhóm '${group.name}' đã chọn đề tài '${topic.name}' của bạn`,
			type: 'CHOOSE_TOPIC',
		});
	}
	async updateAssignForLecturerOfTopic({ topic, group }: ValidatedInput) {
		// autho create assign advisor for lecturer of topic
		const groupLecturer = await this.groupLecturerDao.insertEntity(
			GroupLecturer.create({ name: `ADVISOR -${topic.name} - ${group.id}`, term: group.term, type: TypeEvaluation.ADVISOR })
		);
		const groupLecturerMember = await this.groupLecturerMemberDao.insertEntity(
			GroupLecturerMember.create({
				lecturerTerm: topic.lecturerTerm,
				groupLecturer,
			})
		);

		const assign = await this.assignDao.insertEntity(
			Assign.create({
				group,
				groupLecturer,
				typeEvaluation: TypeEvaluation.ADVISOR,
			})
		);
	}
}
