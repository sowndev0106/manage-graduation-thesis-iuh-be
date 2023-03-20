import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IGroupDao from '@student/domain/daos/IGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupValidate from '@core/domain/validate-objects/RequestJoinGroupValidate';

interface ValidatedInput {
	studentId: number;
	type: TypeRequestJoinGroup;
}

@injectable()
export default class GetRequestJoinGroupHandler extends RequestHandler {
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('RequestJoinGroupDao') private requestJoinGroupDao!: IRequestJoinGroupDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const type = this.errorCollector.collect('type', () => RequestJoinGroupValidate.validate({ value: request.query['type'] }));
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { studentId, type };
	}
	async handle(request: Request) {
		const input = await this.validate(request);

		const inviteJoinGroup = await this.requestJoinGroupDao.findAllByStudentIdAndType(input.studentId, input.type);

		return inviteJoinGroup.map(e => e.toJSON);
	}
}
