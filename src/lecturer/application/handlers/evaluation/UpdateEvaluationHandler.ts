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
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import Term from '@core/domain/entities/Term';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
const sumGradeMax = 10;
interface ValidatedInput {
	type: TypeEvaluation;
	term: Term;
	name: string;
	gradeMax: number;
	description: string;
	evaluation: Evaluation;
}
@injectable()
export default class UpdateEvaluationHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.body['type'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const name = this.errorCollector.collect('name', () => Text.validate({ value: request.body['name'] }));
		const gradeMax = this.errorCollector.collect('gradeMax', () => PositiveNumber.validate({ value: request.body['gradeMax'] }));
		const description = this.errorCollector.collect('description', () => Text.validate({ value: request.body['description'], required: false }));
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
			description,
			gradeMax,
			name,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		// update entiry
		input.evaluation.update({
			term: input.term,
			type: input.type,
			name: input.name,
			description: input.description,
			gradeMax: input.gradeMax,
		});

		const evaluations = await this.evaluationDao.findAll(input.term.id, input.type);

		let evaluationExist = false;

		for (const evaluation of evaluations) {
			// check duplicate name
			if (evaluation.name == input.name && evaluation.id != input.evaluation.id) {
				throw new Error(`Duplicate Name: ${evaluation.name} in evaluation: ${evaluation.id}`);
			}
			if (evaluation.id == input.evaluation.id) {
				evaluation.update({ ...input.evaluation.props });
				evaluationExist = true;
			}
		}

		if (evaluationExist == false) {
			evaluations.push(input.evaluation);
		}

		const sumGrade = evaluations.reduce((sum, evaluation) => sum + evaluation.gradeMax, 0);

		if (sumGrade > sumGradeMax) {
			throw new Error(`sum all grade max in deatail can\'t > ${sumGradeMax}`);
		}

		const evaluation = await this.evaluationDao.updateEntity(input.evaluation);

		return evaluation?.toJSON;
	}
}
