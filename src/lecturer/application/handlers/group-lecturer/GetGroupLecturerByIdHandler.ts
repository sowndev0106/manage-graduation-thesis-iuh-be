import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	groupLecturerId: number;
}

@injectable()
export default class GetGroupLecturerByIdHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const groupLecturerId = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { groupLecturerId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const groupLecturer = await this.groupLecturerDao.findEntityById(input.groupLecturerId);

		if (!groupLecturer) throw new NotFoundError('groupLecturer not found');

		const members = await this.groupLecturerMemberDao.findAll(groupLecturer.id!);

		groupLecturer.update({ members });

		return groupLecturer.toJSON;
	}
}
