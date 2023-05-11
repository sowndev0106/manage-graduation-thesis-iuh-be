import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import Lecturer from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	lecturerTerm: LecturerTerm;
	groupLecturer: GroupLecturer;
}
@injectable()
export default class CreateGroupLecturerMemberHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
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
			groupLecturer,
			lecturerTerm,
		};
	}

	async handle(request: Request) {
		const { groupLecturer, lecturerTerm } = await this.validate(request);

		let member = await this.groupLecturerMemberDao.findOne({
			groupLecturerId: groupLecturer.id!,
			lecturerTermId: lecturerTerm.id!,
		});

		if (!member) {
			member = await this.groupLecturerMemberDao.insertEntity(
				GroupLecturerMember.create({
					groupLecturer: groupLecturer!,
					lecturerTerm,
				})
			);
		}

		const members = await this.groupLecturerMemberDao.findAll({
			groupLecturerId: groupLecturer.id!,
		});
		groupLecturer.update({ members });

		return groupLecturer?.toJSON;
	}
}
