import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroup, { TypeRquestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import SortText from '@core/domain/validate-objects/SortText';
import IStudentDao from '@student/domain/daos/IStudentDao';

interface ValidatedInput {
	termId: number;
	studentId: number;
}

@injectable()
export default class GetAllRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (!group) throw new Error("You don't have a group");

		const inviteJoinGroup = await this.requestJoinGroupDao.findAllByGroupIdAndType(group.id!, TypeRquestJoinGroup.REQUEST_JOIN);

		return inviteJoinGroup.map(e => e.toJSON);
	}
}
