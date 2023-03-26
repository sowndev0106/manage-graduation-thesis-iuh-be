import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import IEvaluationDetailDao from '@lecturer/domain/daos/IEvaluationDetailDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Term from '@core/domain/entities/Term';
import Evaluation from '@core/domain/entities/Evaluation';
import NotFoundError from '@core/domain/errors/NotFoundError';
import EvaluationDetail from '@core/domain/entities/EvaluationDetail';

interface ValidatedInput {
	evaluationDetail: EvaluationDetail;
}

@injectable()
export default class DeleteEvaluationDetailHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('EvaluationDetailDao') private evaluationDetailDao!: IEvaluationDetailDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		const evaluationDetail = await this.evaluationDetailDao.findEntityById(id);
		if (!evaluationDetail) throw new NotFoundError('evaluation not found');

		return { evaluationDetail };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let result = await this.evaluationDetailDao.deleteEntity(input.evaluationDetail);

		return result ? 'delete evaluation detail success' : 'delete Evaluation detail fail';
	}
}
