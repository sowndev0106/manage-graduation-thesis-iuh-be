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
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Text from '@core/domain/validate-objects/Text';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
const sumGradeMax = 10;
interface ValidatedInput {
	name: string;
	gradeMax: number;
	evaluation: Evaluation;
}
@injectable()
export default class CreateEvaluationDetailHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('EvaluationDetailDao') private evaluationDetailDao!: IEvaluationDetailDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => Text.validate({ value: request.body['name'] }));
		const gradeMax = this.errorCollector.collect('gradeMax', () => PositiveNumber.validate({ value: request.body['gradeMax'] }));
		const evaluationId = this.errorCollector.collect('evaluationId', () => EntityId.validate({ value: request.body['evaluationId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let evaluation = await this.evaluationDao.findEntityById(evaluationId);
		if (!evaluation) throw new NotFoundError(`evaluation ${evaluationId} not found`);

		return {
			name,
			gradeMax,
			evaluation,
		};
	}

	async handle(request: Request) {
		const { evaluation, gradeMax, name } = await this.validate(request);
		const details = await this.evaluationDetailDao.findAll(evaluation.id);

		const isDuplicateName = details.find(e => e.name == name);
		if (isDuplicateName) {
			throw new Error(`Duplicate Name: ${name} in evaluation: ${evaluation.id}`);
		}

		let evaluationDetail = EvaluationDetail.create({
			gradeMax,
			name,
			evaluation: Evaluation.createById(evaluation.id),
		});

		details.push(evaluationDetail);
		evaluation.update({ details });

		const sumGrade = evaluation.sumGradeMax;

		if (sumGrade >= sumGradeMax) {
			throw new Error(`sum all grade max in deatail can\'t > ${sumGradeMax}`);
		}

		evaluationDetail = await this.evaluationDetailDao.insertEntity(evaluationDetail);

		return evaluationDetail?.toJSON;
	}
}
