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
import IStudentDao from '@student/domain/daos/IStudentDao';
import { TypeRoleUser } from '@core/domain/entities/Lecturer';
import MailService from '@core/infrastructure/nodemailer/service/MailService';

interface ValidatedInput {
	username: string;
}

@injectable()
export default class SendEmailResetPasswordHandler extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const student = await this.studentDao.findByUsername(input.username);
		if (!student) throw new NotFoundError('email not found');
		if (!student.email) {
			throw new Error('Student missing email');
		}

		const token = JWTService.signTokenResetPassword(student.id!, 'student');
		await MailService.sendEmailForgotPassword({
			to: student.email,
			token,
		});
		return { email: student.email };
	}
}
