import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

interface ValidatedInput {
	lecturerId: number;
	termId: number;
}

@injectable()
export default class GetListAssignByLecturerHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.params['lecturerId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: true }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { lecturerId, termId };
	}

	async handle(request: Request) {
		const { lecturerId, termId } = await this.validate(request);
		const assigns = await this.assignDao.findByLecturer(termId, lecturerId);
		return assigns.map(e => e.toJSON);
	}
}
