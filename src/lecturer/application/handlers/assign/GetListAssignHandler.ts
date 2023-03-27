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
	lecturerId: number;
	termId: number;
}

@injectable()
export default class GetAssignByIdHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.query['type'], required: false }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.query['groupId'], required: false }));
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.query['lecturerId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: true }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { type, groupId, lecturerId, termId };
	}

	async handle(request: Request) {
		const { type, groupId, lecturerId, termId } = await this.validate(request);
		const assigns = await this.assignDao.findAll(lecturerId, termId, type, groupId);

		return assigns.map(e => e.toJSON);
	}
}
