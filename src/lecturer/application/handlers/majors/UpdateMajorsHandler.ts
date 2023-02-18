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

interface ValidatedInput {
	name: string;
	headLecturerId?: number;
	id: number;
}
@injectable()
export default class UpdateMajorsHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const headLecturerId = this.errorCollector.collect('headLecturerId', () =>
			EntityId.validate({ value: request.body['headLecturerId'], required: false })
		);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			id,
			name,
			headLecturerId,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let majors = await this.majorsDao.findEntityById(input.id);
		if (!majors) {
			throw new Error('majors not found');
		}

		const majorsByName = await this.majorsDao.findByName(input.name);
		if (majorsByName && majorsByName?.id != input.id) {
			throw new Error('name already exists');
		}

		let headLecturer;
		if (input.headLecturerId) {
			headLecturer = await this.lecturerDao.findEntityById(input.headLecturerId);
			if (!headLecturer) throw new NotFoundError('lecturer not found');
		}

		majors = await this.majorsDao.updateEntity(
			Majors.create(
				{
					name: input.name,
					headLecturer: headLecturer,
					updatedAt: new Date(),
				},
				input.id
			)
		);

		if (!majors) throw new Error('Create Majors fail');

		return majors.toJSON;
	}
}
