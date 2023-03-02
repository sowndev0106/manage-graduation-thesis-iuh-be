import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@student/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import IStudentDao from '@student/domain/daos/IStudentDao';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class GetStudentById extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const student = await this.studentDao.findGraphEntityById(input.id, 'user');

		return student?.toJSON || {};
	}
}
