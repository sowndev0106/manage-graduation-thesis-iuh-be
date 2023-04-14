import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

interface ValidatedInput {
	termId: number;
	groupId: number;
	typeEvaluation: TypeEvaluation;
}

@injectable()
export default class GetListGroupLecturerHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const groupId = this.errorCollector.collect('groupId', () => EntityId.validate({ value: request.query['groupId'], required: false }));
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () =>
			TypeEvaluationValidate.validate({ value: request.query['typeEvaluation'], required: false })
		);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, groupId, typeEvaluation };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const groupLecturers = await this.groupLecturerDao.findAll({
			termId: input.termId,
			assign: {
				groupStudentId: input.groupId,
				typeEvaluation: input.typeEvaluation,
			},
		});

		return groupLecturers.map(e => e.toJSON);
	}
}
