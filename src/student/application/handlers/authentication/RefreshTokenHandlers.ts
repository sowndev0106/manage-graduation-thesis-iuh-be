import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import Text from '@core/domain/validate-objects/Text';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';

interface ValidatedInput {
	refreshToken: string;
}

@injectable()
export default class RefreshTokenHandlers extends RequestHandler {
	async validate(request: Request): Promise<ValidatedInput> {
		const refreshToken = this.errorCollector.collect('refreshToken', () => Text.validate({ value: request.body['refreshToken'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { refreshToken };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const { id, role } = JWTService.verifyRefrestToken(input.refreshToken);

		const { accessToken, refreshToken } = JWTService.signAccessAndRefreshToken(id, role);

		return { accessToken, refreshToken };
	}
}
