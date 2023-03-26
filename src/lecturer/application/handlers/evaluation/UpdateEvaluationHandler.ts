import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IEvaluationDetailDao from '@lecturer/domain/daos/IEvaluationDetailDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import EvaluationDetail from '@core/domain/entities/EvaluationDetail';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Term from '@core/domain/entities/Term';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';

interface ValidatedInput {
	type: TypeEvaluation;
	term: Term;
	evaluation: Evaluation;
}
@injectable()
export default class UpdateEvaluationHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('EvaluationDetailDao') private evaluationDetailDao!: IEvaluationDetailDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.body['type'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		const evaluation = await this.evaluationDao.findEntityById(id);
		if (!evaluation) throw new NotFoundError('evaluation not found');

		return {
			type,
			term,
			evaluation,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		let evaluationExist = await this.evaluationDao.findOne(input.term.id!, input.type);
		if (evaluationExist && evaluationExist?.id != input.evaluation.id) {
			throw new Error(`Evaluation type ${input.type} already exists in term ${input.term.name}`);
		}
		input.evaluation.update({
			type: input.type,
			term: input.term,
		});
		const evaluation = await this.evaluationDao.updateEntity(input.evaluation);

		return evaluation?.toJSON;
	}
}
