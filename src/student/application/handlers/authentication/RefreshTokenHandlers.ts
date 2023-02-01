import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import IUserDao from '@student/domain/daos/IUserDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ConflictError from '@core/domain/errors/ConflictError';
import User from '@core/domain/entities/User';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import Text from '@core/domain/validate-objects/Text';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefrestToken } from '@core/infrastructure/jsonwebtoken';

interface ValidatedInput {
	refreshToken: string;
}

@injectable()
export default class RefreshTokenHandlers extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const refreshToken = this.errorCollector.collect('refreshToken', () => Text.validate({ value: request.body['refreshToken'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { refreshToken };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const { id, role } = verifyRefrestToken(input.refreshToken);

		const accessToken = signAccessToken(id, role);
		const refreshToken = signRefreshToken(id, role);

		return { accessToken, refreshToken };
	}
}
