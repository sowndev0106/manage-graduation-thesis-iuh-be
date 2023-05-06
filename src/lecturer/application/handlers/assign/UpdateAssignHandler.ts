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
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import { type } from 'os';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
const sumGradeMax = 10;
interface ValidatedInput {
	typeEvaluation: TypeEvaluation;
	group: Group;
	groupLecturer: GroupLecturer;
	assign: Assign;
}
@injectable()
export default class UpdateAssignHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () => TypeEvaluationValidate.validate({ value: request.body['typeEvaluation'] }));
		const groupLecturerId = this.errorCollector.collect('groupLecturerId', () => EntityId.validate({ value: request.body['groupLecturerId'] }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.body['groupId'] }));
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		let assign = await this.assignDao.findEntityById(id);
		if (!assign) throw new NotFoundError('assign not found');

		let group = await this.groupDao.findEntityById(groupId);
		if (!group) throw new NotFoundError(' group not found');

		let groupLecturer = await this.groupLecturerDao.findEntityById(groupLecturerId);
		if (!groupLecturer) throw new NotFoundError('groupLecturer not found');

		return {
			typeEvaluation,
			group,
			groupLecturer,
			assign,
		};
	}

	async handle(request: Request) {
		const { typeEvaluation, group, groupLecturer, assign } = await this.validate(request);
		if (group.termId != groupLecturer.termId) {
			throw new Error('term of group student not same group lecturer');
		}
		// update entiry
		assign.update({
			typeEvaluation: typeEvaluation,
			group: group,
			groupLecturer: groupLecturer,
		});

		const reponse = await this.assignDao.updateEntity(assign);

		return reponse?.toJSON;
	}
}
