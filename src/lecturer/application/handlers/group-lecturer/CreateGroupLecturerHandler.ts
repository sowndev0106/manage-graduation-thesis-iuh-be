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
import Term from '@core/domain/entities/Term';
import EntityIds from '@core/domain/validate-objects/EntityIds';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import ErrorCode from '@core/domain/errors/ErrorCode';
import TypeEvaluationValidate from '@core/domain/validate-objects/TypeEvaluationValidate';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

interface ValidatedInput {
	name: string;
	term: Term;
	type: TypeEvaluation;
	lecturerTerms: LecturerTerm[];
}
@injectable()
export default class CreateGroupLecturerHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupMemberDao!: IGroupLecturerMemberDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const type = this.errorCollector.collect('type', () => TypeEvaluationValidate.validate({ value: request.body['type'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerIds = this.errorCollector.collect('lecturerIds', () => EntityIds.validate({ value: request.body['lecturerIds'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		const lecturerTerms: LecturerTerm[] = [];

		for (const lecturerId of lecturerIds) {
			const lecturerTerm = await this.lecturerTermDao.findOne(termId, lecturerId);
			if (lecturerTerm) lecturerTerms.push(lecturerTerm);
		}

		return {
			name,
			term,
			lecturerTerms,
			type,
		};
	}

	async handle(request: Request) {
		const { name, term, lecturerTerms, type } = await this.validate(request);

		let groupLecturer = await this.groupLecturerDao.findOne({
			termId: term.id!,
			name,
		});
		if (groupLecturer) throw new ErrorCode('GROUP_LECTURER_DUPLICATE_NAME', `group name ${name}  already exists in student`);

		groupLecturer = await this.groupLecturerDao.insertEntity(
			GroupLecturer.create({
				term: term,
				name: name,
				type,
			})
		);

		const membersPromise = lecturerTerms.map(async lecturerTerm => {
			return await this.groupMemberDao.insertEntity(
				GroupLecturerMember.create({
					groupLecturer: groupLecturer!,
					lecturerTerm,
				})
			);
		});

		groupLecturer.update({ members: await Promise.all(membersPromise) });

		return groupLecturer?.toJSON;
	}
}
