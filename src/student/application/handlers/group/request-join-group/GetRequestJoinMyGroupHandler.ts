import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupValidate from '@core/domain/validate-objects/RequestJoinGroupValidate';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import ITermDao from '@student/domain/daos/ITermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';

interface ValidatedInput {
	studentTerm: StudentTerm;
	type: TypeRequestJoinGroup;
}

@injectable()
export default class GetRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const type = this.errorCollector.collect('type', () => RequestJoinGroupValidate.validate({ value: request.query['type'] }));
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

		const group = await this.groupDao.findOne({
			studentTermId: input.studentTerm.id!,
		});
		if (!group) throw new Error("You don't have a group");

		const inviteJoinGroup = await this.requestJoinGroupDao.findAll({
			groupId: group.id!,
			type: input.type,
		});

		return inviteJoinGroup.map(e => e.toJSON);
	}
}
