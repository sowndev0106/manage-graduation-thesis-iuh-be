import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import PDFKitService from '@core/infrastructure/pdfkit/PDFKitService';
interface ValidatedInput {
	type: TypeEvaluation;
	termId: number;
}

@injectable()
export default class GenerateEvaluationHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.query['type'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: true }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { type, termId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const evaluations = await this.evaluationDao.findAll(input.termId, input.type);

		const doc = PDFKitService.generateEvalutionPDF(evaluations);

		return doc;
	}
}
