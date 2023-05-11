import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Majors from '@core/domain/entities/Majors';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	name: string;
	id: number;
}
@injectable()
export default class UpdateMajorsHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			id,
			name,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let majors = await this.majorsDao.findEntityById(input.id);
		if (!majors) {
			throw new NotFoundError('majors not found');
		}

		const majorsByName = await this.majorsDao.findByName(input.name);
		if (majorsByName && majorsByName?.id != input.id) {
			throw new NotFoundError('name already exists');
		}

		majors = await this.majorsDao.updateEntity(
			Majors.create(
				{
					name: input.name,
					updatedAt: new Date(),
				},
				input.id
			)
		);

		if (!majors) throw new ErrorCode('FAIL_CREATE_ENTITY', 'Create Majors fail');

		return majors.toJSON;
	}
}
