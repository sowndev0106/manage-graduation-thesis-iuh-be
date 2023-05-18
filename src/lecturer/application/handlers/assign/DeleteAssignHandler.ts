import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Term from '@core/domain/entities/Term';
import Assign from '@core/domain/entities/Assign';
import NotFoundError from '@core/domain/errors/NotFoundError';
import { assign } from 'lodash';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import NotificationLecturerService from '@core/service/NotificationLecturerService';
import { TypeNotificationLecturer } from '@core/domain/entities/NotificationLecturer';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

interface ValidatedInput {
	assign: Assign;
}

@injectable()
export default class DeleteAssignHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		const assign = await this.assignDao.findEntityById(id);
		if (!assign) throw new NotFoundError('assign not found');

		return { assign };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let result = await this.assignDao.deleteEntity(input.assign);

		const group = await this.groupDao.findEntityById(input.assign.groupId);

		const message = `Bạn vừa bị hủy bỏ quyền chấm điểm cho nhóm ${group?.name}`;

		const members = await this.groupLecturerMemberDao.findAll({ groupLecturerId: input.assign.groupLecturerId! });
		const typeNoti: TypeNotificationLecturer =
			input.assign.typeEvaluation == TypeEvaluation.REVIEWER
				? 'ASSIGN_REVIEW'
				: input.assign.typeEvaluation == TypeEvaluation.SESSION_HOST
				? 'ASSIGN_SESSION_HOST'
				: 'ASSIGN_ADVISOR';

		for (const member of members) {
			await NotificationLecturerService.send({
				user: member.lecturerTerm,
				message,
				type: typeNoti,
			});
		}
		return result ? 'Delete Assign success' : 'Delete Assign fail';
	}
}
