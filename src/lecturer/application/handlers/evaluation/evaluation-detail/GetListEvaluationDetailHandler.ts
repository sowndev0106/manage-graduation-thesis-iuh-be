import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import IEvaluationDetailDao from '@lecturer/domain/daos/IEvaluationDetailDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	evaluation: Evaluation;
}

@injectable()
export default class GetListEvaluationDetailHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('EvaluationDetailDao') private evaluationDetailDao!: IEvaluationDetailDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const evaluationId = this.errorCollector.collect('evaluationId', () => EntityId.validate({ value: request.query['evaluationId'], required: true }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let evaluation = await this.evaluationDao.findEntityById(evaluationId);
		if (!evaluation) throw new NotFoundError(`evaluation ${evaluationId} not found`);
		return { evaluation };
	}

	async handle(request: Request) {
		const { evaluation } = await this.validate(request);
		const details = await this.evaluationDetailDao.findAll(evaluation.id);

		return details.map(e => e.toJSON);
	}
}
