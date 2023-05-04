import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@student/domain/daos/ITermDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ILecturerTermDao from '@student/domain/daos/ILecturerTermDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';

interface ValidatedInput {
	majorsId: number;
	studentId: number;
}

@injectable()
export default class GetTermNowHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.query['majorsId'] }));
		const studentId = Number(request.headers['id']);
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { majorsId, studentId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.termDao.findNowByMajorsId(input.majorsId);

		if (!term) {
			throw new NotFoundError('term not found');
		}
		const studentIdTerm = await this.studentTermDao.findOne(term.id!, input.studentId);

		const allow = !!studentIdTerm;

		return { allow, term: term?.toJSON };
	}
}
