import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';

interface ValidatedInput {
	termId: number;
	type: TypeEvaluation;
}

@injectable()
export default class GetListLecturerAvailableGroupHandler extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.query['type'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { type, termId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const lecturers = await this.lecturerDao.findLecturerAvailableGroup(input.termId, input.type);

		return lecturers?.map(e => e.toJSON);
	}
}
