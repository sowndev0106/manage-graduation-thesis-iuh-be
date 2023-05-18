import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

interface ValidatedInput {
	type: TypeEvaluation;
	groupId: number;
	groupLecturerId: number;
	termId: number;
}

@injectable()
export default class GetAssignByIdHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.query['type'], required: false }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.query['groupId'], required: false }));
		const groupLecturerId = this.errorCollector.collect('groupLecturerId', () =>
			EntityId.validate({ value: request.query['groupLecturerId'], required: false })
		);
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: true }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { type, groupId, groupLecturerId, termId };
	}

	async handle(request: Request) {
		const { type, groupId, groupLecturerId, termId } = await this.validate(request);
		const assigns = await this.assignDao.findAll({ groupLecturerId, termId, type, groupId });
		let assignsFilter = assigns;
		// default remove type =  ADVISOR
		if (!type) {
			assignsFilter = assigns.filter(e => e.typeEvaluation != TypeEvaluation.ADVISOR);
		}

		return assigns.map(e => e.toJSON);
	}
}
