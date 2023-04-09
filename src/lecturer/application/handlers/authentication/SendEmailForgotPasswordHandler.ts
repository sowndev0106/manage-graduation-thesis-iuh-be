import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import NotFoundError from '@core/domain/errors/NotFoundError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import MailService from '@core/infrastructure/nodemailer/service/MailService';

interface ValidatedInput {
	username: string;
}

@injectable()
export default class SendEmailResetPasswordHandler extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const lecturer = await this.lecturerDao.findByUsername(input.username);
		if (!lecturer) throw new NotFoundError('email not found');
		if (!lecturer.email) {
			throw new Error('Lecturer missing email');
		}

		const token = JWTService.signTokenResetPassword(lecturer.username!, 'lecturer');
		await MailService.sendEmailForgotPassword({
			to: lecturer.email,
			token,
			type: 'lecturer',
		});

		return { email: lecturer.email };
	}
}
