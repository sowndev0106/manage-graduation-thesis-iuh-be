import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Password from '@core/domain/validate-objects/Password';
import { compareTextBcrypt } from '@core/infrastructure/bcrypt';
import ForbiddenError from '@core/domain/errors/ForbiddenError';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import IStudentDao from '@student/domain/daos/IStudentDao';

interface ValidatedInput {
	id: number;
	oldPassword: string;
	newPassword: string;
}

@injectable()
export default class UpdateMyPasswordHandler extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
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
		let student = await this.studentDao.findEntityById(input.id);

		if (!student) throw new Error('Error! Please login again');

		const isCorrectPassword = await compareTextBcrypt(input.oldPassword, student?.password!);

		if (!isCorrectPassword) throw new ForbiddenError('incorect password');

		if (input.newPassword == input.oldPassword) return student?.toJSON;

		const newPassword = await encriptTextBcrypt(input.newPassword);

		student?.update({ password: newPassword });

		student = await this.studentDao.updateEntity(student);

		return student?.toJSON;
	}
}
