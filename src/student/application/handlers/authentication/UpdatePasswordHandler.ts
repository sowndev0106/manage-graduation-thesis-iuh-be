import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import NotFoundError from '@core/domain/errors/NotFoundError';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import IStudentDao from '@student/domain/daos/IStudentDao';
import Password from '@core/domain/validate-objects/Password';

interface ValidatedInput {
	username: string;
	password: string;
}

@injectable()
export default class UpdatePasswordHandler extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const token = request.body['token'];
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));
		if (!token) {
			throw new Error('Token missing');
		}
		const { username, type } = JWTService.verifyTokenResetPassword(token);
		if (type != 'student') {
			throw new Error('Error token');
		}

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const student = await this.studentDao.findByUsername(input.username);
		if (!student) throw new NotFoundError('student not found');

		const passwordEncript = await encriptTextBcrypt(input.password);
		student.update({ password: passwordEncript });

		await this.studentDao.updateEntity(student);

		return student.toJSON;
	}
}
