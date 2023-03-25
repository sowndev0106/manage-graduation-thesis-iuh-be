import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@student/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';
import IStudentDao from '@student/domain/daos/IStudentDao';

interface ValidatedInput {
	termId: number;
	groupExists?: boolean;
}

@injectable()
export default class GetListStudent extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const groupExists = this.errorCollector.collect('groupExists', () =>
			BooleanValidate.validate({ value: request.query['groupExists']!, required: false })
		);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, groupExists };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const students = await this.studentDao.findAll(input.termId, input.groupExists);

		return students?.map(e => e.toJSON);
	}
}
