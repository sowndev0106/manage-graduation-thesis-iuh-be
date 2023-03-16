import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import NotFoundError from '@core/domain/errors/NotFoundError';
import { compareTextBcrypt } from '@core/infrastructure/bcrypt';
import ForbiddenError from '@core/domain/errors/ForbiddenError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';

interface ValidatedInput {
	username: string;
	password: string;
}

@injectable()
export default class LoginHandlers extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const lecturer = await this.lecturerDao.findByUsername(input.username);

		if (!lecturer) throw new NotFoundError('incorrect username');

		const isCorrectPassword = await compareTextBcrypt(input.password, lecturer.password!);

		if (!isCorrectPassword) throw new ForbiddenError('incorect password');

		const { accessToken, refreshToken } = JWTService.signAccessAndRefreshToken(lecturer.id!, lecturer.role);

		return { accessToken, refreshToken, user: { ...lecturer?.toJSON } };
	}
}
