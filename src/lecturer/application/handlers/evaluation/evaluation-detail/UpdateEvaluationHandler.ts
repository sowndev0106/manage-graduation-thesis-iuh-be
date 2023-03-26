import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IEvaluationDetailDao from '@lecturer/domain/daos/IEvaluationDetailDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Term from '@core/domain/entities/Term';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
import EvaluationDetail from '@core/domain/entities/EvaluationDetail';
const sumGradeMax = 10;

interface ValidatedInput {
	evaluationDetail: EvaluationDetail;
	evaluation: Evaluation;
}
@injectable()
export default class UpdateEvaluationDetailHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('EvaluationDetailDao') private evaluationDetailDao!: IEvaluationDetailDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => Text.validate({ value: request.body['name'] }));
		const gradeMax = this.errorCollector.collect('gradeMax', () => PositiveNumber.validate({ value: request.body['gradeMax'] }));
		const evaluationId = this.errorCollector.collect('evaluationId', () => EntityId.validate({ value: request.body['evaluationId'] }));
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let evaluationDetail = await this.evaluationDetailDao.findEntityById(id);
		if (!evaluationDetail) throw new NotFoundError('evaluationDetail not found');

		const evaluation = await this.evaluationDao.findEntityById(evaluationId);
		if (!evaluation) throw new NotFoundError('evaluation not found');

		evaluationDetail.update({ name, gradeMax });

		return {
			evaluation,
			evaluationDetail,
		};
	}

	async handle(request: Request) {
		const { evaluation, evaluationDetail } = await this.validate(request);

		const details = await this.evaluationDetailDao.findAll(evaluation.id);

		let isExistDetail = false;
		for (const detail of details) {
			// check duplicate name
			if (detail.name == evaluationDetail.name && detail.id != evaluationDetail.id) {
				throw new Error(`Duplicate Name: ${evaluationDetail.name} in evaluation: ${evaluation.id}`);
			}
			if (detail.id == evaluationDetail.id) {
				detail.update({ ...evaluationDetail });
				isExistDetail = true;
			}
		}
		if ((isExistDetail = false)) {
			details.push(evaluationDetail);
		}

		const sumGrade = evaluation.sumGradeMax;

		if (sumGrade >= sumGradeMax) {
			throw new Error(`sum all grade max in deatail can\'t > ${sumGradeMax}`);
		}

		const repponse = await this.evaluationDetailDao.updateEntity(evaluationDetail);

		return repponse ? repponse.toJSON : 'Update fail';
	}
}
