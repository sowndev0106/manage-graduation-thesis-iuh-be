import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';

interface ValidatedInput {
	majorsId: number;
	isHeadLecturer: boolean;
}

@injectable()
export default class GetListStudent extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.query['majorsId'], required: false }));
		const isHeadLecturer = this.errorCollector.collect('isHeadLecturer', () =>
			BooleanValidate.validate({ value: request.query['isHeadLecturer']!, required: false })
		);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { majorsId, isHeadLecturer };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const students = await this.studentDao.findAll(input.majorsId);

		return students?.map(e => e.toJSON);
	}
}
