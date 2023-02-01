import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IUserDao from '@student/domain/daos/IUserDao';
import ConflictError from '@core/domain/errors/ConflictError';
import IMajorsDao from '@student/domain/daos/IMajorsDao';

interface ValidatedInput {
	id: number;
	role: string;
}

@injectable()
export default class GetMyInfoHandlers extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const data = request.headers;

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		return { id: Number(data.id), role: String(data.role) };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let user = await this.userDao.findEntityById(input.id);

		if (!user) throw new ConflictError('student not found');

		return user!.toResponses;
	}
}
