import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Password from '@core/domain/validate-objects/Password';
import { compareTextBcrypt } from '@core/infrastructure/bcrypt';
import ForbiddenError from '@core/domain/errors/ForbiddenError';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	id: number;
	oldPassword: string;
	newPassword: string;
}

@injectable()
export default class UpdateMyPasswordHandler extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const oldPassword = this.errorCollector.collect('oldPassword', () => Password.validate({ value: request.body['oldPassword'] }));
		const newPassword = this.errorCollector.collect('newPassword', () => Password.validate({ value: request.body['newPassword'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			id: Number(request.headers['id']),
			oldPassword,
			newPassword,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		let lecturer = await this.lecturerDao.findEntityById(input.id);
		if (!lecturer) throw new NotFoundError('Error! Please login again');

		if (input.newPassword == input.oldPassword) return lecturer?.toJSON;

		const isCorrectPassword = await compareTextBcrypt(input.oldPassword, lecturer?.password!);

		if (!isCorrectPassword) throw new ForbiddenError('incorect password');

		if (input.newPassword == input.oldPassword) return lecturer?.toJSON;

		const newPassword = await encriptTextBcrypt(input.newPassword);

		lecturer?.update({ password: newPassword });

		lecturer = await this.lecturerDao.updateEntity(lecturer);

		return lecturer?.toJSON;
	}
}
