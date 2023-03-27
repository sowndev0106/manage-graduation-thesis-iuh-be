import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import Term from '@core/domain/entities/Term';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
import Assign from '@core/domain/entities/Assign';
import Group from '@core/domain/entities/Group';
import Lecturer from '@core/domain/entities/Lecturer';
import { type } from 'os';
import IGroupDao from '@student/domain/daos/IGroupDao';
import ILecturerDao from '@student/domain/daos/ILecturerDao';
const sumGradeMax = 10;
interface ValidatedInput {
	typeEvaluation: TypeEvaluation;
	group: Group;
	lecturer: Lecturer;
	assign: Assign;
}
@injectable()
export default class UpdateAssignHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () => TypeEvaluationValidate.validate({ value: request.body['typeEvaluation'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.body['lecturerId'] }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.body['groupId'] }));
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let assign = await this.assignDao.findEntityById(id);
		if (!assign) throw new NotFoundError('assign not found');

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
			assign,
		};
	}

	async handle(request: Request) {
		const { typeEvaluation, group, lecturer, assign } = await this.validate(request);
		// update entiry
		assign.update({
			typeEvaluation: typeEvaluation,
			group: group,
			lecturer: lecturer,
		});

		const reponse = await this.assignDao.updateEntity(assign);

		return reponse?.toJSON;
	}
}
