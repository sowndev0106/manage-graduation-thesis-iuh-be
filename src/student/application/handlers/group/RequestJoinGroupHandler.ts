import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ITermDao from '@student/domain/daos/ITermDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup, { TypeRquestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import Student from '@core/domain/entities/Student';
import SortText from '@core/domain/validate-objects/SortText';

interface ValidatedInput {
	groupId: number;
	studentId: number;
	message?: string;
}

@injectable()
export default class RequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
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

		let requestJoinGroup = RequestJoinGroup.create({
			group: group,
			student: Student.createById(input.studentId),
			message: input.message,
			type: TypeRquestJoinGroup.REQUEST_JOIN,
		});

		requestJoinGroup = await this.requestJoinGroupDao.insertEntity(requestJoinGroup);

		return requestJoinGroup.toJSON;
	}
}
