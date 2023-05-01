import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupValidate from '@core/domain/validate-objects/RequestJoinGroupValidate';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@student/domain/daos/ITermDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';

interface ValidatedInput {
	studentTerm: StudentTerm;
	type: TypeRequestJoinGroup;
}

@injectable()
export default class GetRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => RequestJoinGroupValidate.validate({ value: request.query['type'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new Error('term not found');
		}

		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${termId}`);
		}
		return { studentTerm, type };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		const inviteJoinGroup = await this.requestJoinGroupDao.findAll({
			studentTermId: input.studentTerm.id!,
			type: input.type,
		});

		return inviteJoinGroup.map(e => e.toJSON);
	}
}
