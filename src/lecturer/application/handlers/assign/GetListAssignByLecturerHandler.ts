import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';

interface ValidatedInput {
	lecturerTerm: LecturerTerm;
	typeEvaluation: TypeEvaluation;
}

@injectable()
export default class GetListAssignByLecturerHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.params['lecturerId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: true }));
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () =>
			TypeEvaluationValidate.validate({ value: request.query['typeEvaluation'], required: false })
		);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const lecturerTerm = await this.lecturerTermDao.findOne(termId, lecturerId);
		if (!lecturerTerm) {
			throw new Error(`lecturer not in term ${termId}`);
		}
		return { lecturerTerm, typeEvaluation };
	}

	async handle(request: Request) {
		const { lecturerTerm, typeEvaluation } = await this.validate(request);

		const assigns = await this.assignDao.findByLecturer({
			lecturerTermId: lecturerTerm.id!,
			typeEvaluation,
		});
		return assigns.map(e => e.toJSON);
	}
}
