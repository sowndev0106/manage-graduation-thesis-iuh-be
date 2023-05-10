import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Majors from '@core/domain/entities/Majors';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	name: string;
	// headLecturerId?: number;
}
@injectable()
export default class CreateMajorsHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			name,
			// headLecturerId,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const isExistName = !!(await this.majorsDao.findByName(input.name));
		if (isExistName) {
			throw new ErrorCode('MAJORS_DUPLICATE_NAME', 'name already exists');
		}
		let majors = await this.majorsDao.insertEntity(
			Majors.create({
				name: input.name,
			})
		);
		if (!majors) throw new ErrorCode('FAIL_CREATE_ENTITY', 'Create Majors fail');

		return majors.toJSON;
	}
}
