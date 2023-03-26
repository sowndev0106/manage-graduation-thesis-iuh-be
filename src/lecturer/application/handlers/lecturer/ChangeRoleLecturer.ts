import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';
import RoleLecturer from '@core/domain/validate-objects/RoleLecturer';
import Lecturer, { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	lecturer: Lecturer;
	role: TypeRoleLecturer;
}

@injectable()
export default class ChangeRoleLecturer extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const role = this.errorCollector.collect('role', () => RoleLecturer.validate({ value: request.body['role'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const lecturer = await this.lecturerDao.findEntityById(id);

		if (!lecturer) {
			throw new NotFoundError('lecturer not found');
		}
		return { lecturer, role };
	}

	async handle(request: Request) {
		const { lecturer, role } = await this.validate(request);

		lecturer.update({ role });

		const lecturerUpdated = await this.lecturerDao.updateEntity(lecturer);

		return lecturerUpdated?.toJSON || {};
	}
}
