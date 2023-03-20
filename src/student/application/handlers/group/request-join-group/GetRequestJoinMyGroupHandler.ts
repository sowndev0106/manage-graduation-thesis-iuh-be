import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupValidate from '@core/domain/validate-objects/RequestJoinGroupValidate';

interface ValidatedInput {
	termId: number;
	studentId: number;
	type: TypeRequestJoinGroup;
}

@injectable()
export default class GetRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const type = this.errorCollector.collect('type', () => RequestJoinGroupValidate.validate({ value: request.query['type'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId, type };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (!group) throw new Error("You don't have a group");

		const inviteJoinGroup = await this.requestJoinGroupDao.findAllByGroupIdAndType(group.id!, input.type);

		return inviteJoinGroup.map(e => e.toJSON);
	}
}
