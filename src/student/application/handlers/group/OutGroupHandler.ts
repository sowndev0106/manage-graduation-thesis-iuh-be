import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import ITermDao from '@student/domain/daos/ITermDao';

interface ValidatedInput {
	termId: number;
	studentId: number;
}

@injectable()
export default class OutGroupHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.termDao.findEntityById(input.termId);

		let result: any;

		if (!term) {
			throw new Error('term not found');
		}

		const group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (!group) throw new Error('You not have group');

		const members = await this.groupMemberDao.findByGroupId(group.id!);

		group.updateMembers(members);

		// check if only me in group then delete group
		if (members.length == 1) {
			await this.groupMemberDao.deleteEntity(members[0]);
			result = await this.groupDao.deleteEntity(group);
		} else {
			const myMember = members.find(e => e.studentId == input.studentId);
			result = myMember && (await this.groupMemberDao.deleteEntity(myMember));
		}

		return result ? 'out group success' : 'out group fail';
	}
}
