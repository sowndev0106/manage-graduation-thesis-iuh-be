import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ITopicDao from '@student/domain/daos/ITopicDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import Term from '@core/domain/entities/Term';
import StudentTerm from '@core/domain/entities/StudentTerm';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	studentTerm: StudentTerm;
	term: Term;
}

@injectable()
export default class GetMyGroupHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: String(request.query['termId']) }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new NotFoundError('term not found');
		}
		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new ErrorCode('STUDENT_NOT_IN_TERM', `student not in term ${termId}`);
		}
		return { term, studentTerm };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findOne({
			studentTermId: input.studentTerm.id!,
		});

		if (!group) return null;

		const members = await this.groupMemberDao.findByGroupId(group.id!);

		group.updateMembers(members);

		if (group.topicId) {
			const topic = await this.topicDao.findEntityById(group.topicId);
			topic && group.updateTopic(topic);
		}

		return group.toJSON;
	}
}
