import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import ValidationError from '@core/domain/errors/ValidationError';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	lecturerTerm: LecturerTerm;
	groupLecturer: GroupLecturer;
}
@injectable()
export default class DeleteGroupLecturerMemberHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const groupLecturerId = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.params['lecturerId'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let groupLecturer = await this.groupLecturerDao.findEntityById(groupLecturerId);
		if (!groupLecturer) throw new NotFoundError('groupLecturer not found');

		const lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) throw new NotFoundError('lecturer not found');

		const lecturerTerm = await this.lecturerTermDao.findOne(groupLecturer.termId!, lecturerId);
		if (!lecturerTerm) {
			throw new ErrorCode('LECTURER_NOT_IN_TERM', `lecturer not in term ${groupLecturer.termId}`);
		}
		return {
			lecturerTerm,
			groupLecturer,
		};
	}

	async handle(request: Request) {
		const { lecturerTerm, groupLecturer } = await this.validate(request);

		let member = await this.groupLecturerMemberDao.findOne({
			groupLecturerId: groupLecturer.id!,
			lecturerTermId: lecturerTerm.id!,
		});

		if (member) {
			await this.groupLecturerMemberDao.deleteEntity(member);
		}

		const members = await this.groupLecturerMemberDao.findAll({ groupLecturerId: groupLecturer.id! });

		groupLecturer.update({ members });

		return groupLecturer?.toJSON;
	}
}
