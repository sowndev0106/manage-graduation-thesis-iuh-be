import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';
import RoleLecturer from '@core/domain/validate-objects/RoleLecturer';
import { TypeRoleLecturer } from '@core/domain/entities/Lecturer';

interface ValidatedInput {
	majorsId?: number;
	role?: TypeRoleLecturer;
	termId?: number;
}

@injectable()
export default class GetListLecturer extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.query['majorsId'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'], required: false }));
		const role = this.errorCollector.collect('role', () => RoleLecturer.validate({ value: request.query['role'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { majorsId, role, termId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const lecturers = await this.lecturerDao.findAll(input.majorsId, input.termId, input.role);

		return lecturers?.map(e => e.toJSON);
	}
}
