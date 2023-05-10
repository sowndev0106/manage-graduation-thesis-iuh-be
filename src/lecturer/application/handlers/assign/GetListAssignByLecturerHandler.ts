import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Lecturer from '@core/domain/entities/Lecturer';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	lecturer: Lecturer;
	typeEvaluation: TypeEvaluation;
}

@injectable()
export default class GetListAssignByLecturerHandler extends RequestHandler {
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.params['lecturerId'], required: false }));
		const typeEvaluation = this.errorCollector.collect('typeEvaluation', () =>
			TypeEvaluationValidate.validate({ value: request.query['typeEvaluation'], required: false })
		);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) {
			throw new NotFoundError(`lecturer not found`);
		}
		return { lecturer, typeEvaluation };
	}

	async handle(request: Request) {
		const { lecturer, typeEvaluation } = await this.validate(request);

		const assigns = await this.assignDao.findByLecturer({
			lecturerId: lecturer.id!,
			typeEvaluation,
		});
		return assigns.map(e => e.toJSON);
	}
}
