import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';

interface ValidatedInput {
	studentId: number;
	termId: number;
}

@injectable()
export default class GetMyGroupHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: String(request.query['termId']) }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.termDao.findEntityById(input.termId);
		if (!term) {
			throw new Error('term not found');
		}

		const group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (!group) return null;

		const members = await this.groupMemberDao.findByGroupId(group.id!);
		group.updateMembers(members);

		return group.toJSON;
	}
}
