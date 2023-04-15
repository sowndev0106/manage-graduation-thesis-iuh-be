import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Assign from '@core/domain/entities/Assign';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import Group from '@core/domain/entities/Group';
import Lecturer from '@core/domain/entities/Lecturer';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import Term from '@core/domain/entities/Term';

interface ValidatedInput {
	typeEvaluation: TypeEvaluation;
	group: Group;
	groupLecturer: GroupLecturer;
}
@injectable()
export default class CreateAssignHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () => TypeEvaluationValidate.validate({ value: request.body['typeEvaluation'] }));
		const groupLecturerId = this.errorCollector.collect('groupLecturerId', () => EntityId.validate({ value: request.body['groupLecturerId'] }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.body['groupId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let group = await this.groupDao.findEntityById(groupId);
		if (!group) throw new NotFoundError(' group not found');

		let groupLecturer = await this.groupLecturerDao.findEntityById(groupLecturerId);
		if (!groupLecturer) throw new NotFoundError('groupLecturer not found');

		return {
			typeEvaluation,
			group,
			groupLecturer,
		};
	}

	async handle(request: Request) {
		const { typeEvaluation, group, groupLecturer } = await this.validate(request);
		let assign = await this.assignDao.findOne({
			type: typeEvaluation,
			groupId: group.id!,
		});
		if (assign) {
			// update assign
			assign.update({
				groupLecturer: groupLecturer,
			});
			await this.assignDao.updateEntity(assign);
		} else {
			await this.assignDao.insertEntity(
				Assign.create({
					typeEvaluation: typeEvaluation,
					group: group,
					groupLecturer: groupLecturer,
				})
			);
		}

		return assign?.toJSON;
	}
}
