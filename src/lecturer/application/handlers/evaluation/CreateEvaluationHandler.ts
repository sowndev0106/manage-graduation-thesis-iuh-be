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
import Text from '@core/domain/validate-objects/Text';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
const sumGradeMax = 10;

interface ValidatedInput {
	type: TypeEvaluation;
	term: Term;
	name: string;
	gradeMax: number;
	description: string;
}
@injectable()
export default class CreateEvaluationHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.body['type'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const name = this.errorCollector.collect('name', () => Text.validate({ value: request.body['name'] }));
		const gradeMax = this.errorCollector.collect('gradeMax', () => PositiveNumber.validate({ value: request.body['gradeMax'] }));
		const description = this.errorCollector.collect('description', () => Text.validate({ value: request.body['description'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		return {
			type,
			term,
			gradeMax,
			description,
			name,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const evaluations = await this.evaluationDao.findAll(input.term.id, input.type);

		const isDuplicateName = evaluations.find(e => e.name == input.name);
		if (isDuplicateName) {
			throw new Error(`Evaluation type '${input.type}' and name '${input.name}' already exists in term ${input.term.name}`);
		}

		const sumGrade = evaluations.reduce((sum, evaluation) => sum + evaluation.gradeMax, 0) + input.gradeMax;

		if (sumGrade > sumGradeMax) {
			throw new Error(`sum all grade max in deatail can\'t > ${sumGradeMax}`);
		}

		const evaluation = await this.evaluationDao.insertEntity(
			Evaluation.create({
				term: input.term,
				type: input.type,
				name: input.name,
				description: input.description,
				gradeMax: input.gradeMax,
			})
		);

		return evaluation?.toJSON;
	}
}
