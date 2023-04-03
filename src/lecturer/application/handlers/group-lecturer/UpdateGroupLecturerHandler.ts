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
import Term from '@core/domain/entities/Term';
import EntityIds from '@core/domain/validate-objects/EntityIds';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';

interface ValidatedInput {
	groupLecturer: GroupLecturer;
	name: string;
	term: Term;
	lecturers: Lecturer[];
}
@injectable()
export default class CreateGroupLecturerHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupMemberDao!: IGroupLecturerMemberDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const groupLecturerId = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerIds = this.errorCollector.collect('lecturerIds', () => EntityIds.validate({ value: request.body['lecturerIds'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		let groupLecturer = await this.groupLecturerDao.findEntityById(groupLecturerId);
		if (!groupLecturer) throw new NotFoundError('group lecturer not found');

		const lecturers: Lecturer[] = [];

		for (const lecturerId of lecturerIds) {
			const lecturer = await this.lecturerDao.findEntityById(lecturerId);
			if (lecturer) lecturers.push(lecturer);
		}

		return {
			name,
			term,
			lecturers,
			groupLecturer,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let groupLecturer = await this.groupLecturerDao.findOne({ termId: input.term.id!, name: input.name });
		if (groupLecturer && groupLecturer.id != input.groupLecturer.id) throw new Error(`group name ${input.name}  already exists in student`);

		if (groupLecturer == null) {
			groupLecturer = input.groupLecturer;
			const members = await this.groupMemberDao.findAll(groupLecturer.id!);
			groupLecturer.update({ members: members });
		}
		groupLecturer.update({ name: input.name });

		await this.updateMember(groupLecturer, input.lecturers);

		groupLecturer = await this.groupLecturerDao.updateEntity(groupLecturer);

		groupLecturer.update({ members: await this.groupMemberDao.findAll(groupLecturer.id!) });

		return groupLecturer?.toJSON;
	}
	private async updateMember(groupLecturer: GroupLecturer, lecturers: Lecturer[]) {
		if (!lecturers || !lecturers.length) return groupLecturer.members;
		const memberInsert: GroupLecturerMember[] = [];
		let members: GroupLecturerMember[] = [];
		const membersDelete: GroupLecturerMember[] = [];

		groupLecturer.members?.forEach(member => {
			if (!lecturers.find(e => e.id == member.lecturerId)) membersDelete.push(member);
			else members.push(member);
		});

		lecturers.forEach(lecturer => {
			if (!groupLecturer.members?.find(e => e.lecturerId == lecturer.id))
				memberInsert.push(GroupLecturerMember.create({ groupLecturer: groupLecturer!, lecturer }));
		});

		// delete
		const deletePromise = membersDelete.map(async member => {
			return await this.groupMemberDao.deleteEntity(member);
		});
		//insert new
		const insertPromise = memberInsert.map(async member => {
			return await this.groupMemberDao.insertEntity(member);
		});
		await Promise.all(deletePromise);
		members = [...members, ...(await Promise.all(insertPromise))];

		return members;
	}
}
