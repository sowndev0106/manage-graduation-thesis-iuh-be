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
import IStudentDao from '@student/domain/daos/IStudentDao';

interface ValidatedInput {
	termId: number;
	studentId: number;
	studentInviteId: number;
	message?: string;
}

@injectable()
export default class InviteJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentInviteId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const message = this.errorCollector.collect('message', () => SortText.validate({ value: request.body['message'], required: false }));

		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId, message, studentInviteId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const group = await this.groupDao.findOneByTermAndStudent(input.termId, input.studentId);
		if (!group) throw new Error("You don't have a group");

		const student = await this.studentDao.findEntityById(input.studentInviteId);
		if (!student) throw new Error('Student not found');

		let requestJoinGroup = RequestJoinGroup.create({
			group: group,
			student: student,
			message: input.message,
			type: TypeRquestJoinGroup.REQUEST_INVITE,
		});

		requestJoinGroup = await this.requestJoinGroupDao.insertEntity(requestJoinGroup);

		return requestJoinGroup.toJSON;
	}
}
