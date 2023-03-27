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

interface ValidatedInput {
	typeEvaluation: TypeEvaluation;
	group: Group;
	lecturer: Lecturer;
}
@injectable()
export default class CreateAssignHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () => TypeEvaluationValidate.validate({ value: request.body['typeEvaluation'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.body['lecturerId'] }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.body['groupId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		let group = await this.groupDao.findEntityById(groupId);
		if (!group) throw new NotFoundError(' group not found');

		let lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) throw new NotFoundError('lecturer not found');

		return {
			typeEvaluation,
			group,
			lecturer,
		};
	}

	async handle(request: Request) {
		const { typeEvaluation, group, lecturer } = await this.validate(request);
		let assign = await this.assignDao.findOne(lecturer.id!, typeEvaluation, group.id);
		if (assign) return assign.toJSON;

		assign = await this.assignDao.insertEntity(
			Assign.create({
				typeEvaluation: typeEvaluation,
				group: group,
				lecturer: lecturer,
			})
		);

		return assign?.toJSON;
	}
}
