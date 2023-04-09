import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import LoginHandlers from '../handlers/authentication/LoginHandlers';
import RegisterHandlers from '../handlers/authentication/RegisterHandlers';
import RefreshTokenHandlers from '../handlers/authentication/RefreshTokenHandlers';
import SendEmailResetPasswordHandler from '../handlers/authentication/SendEmailForgotPasswordHandler';
import ResetPasswordHandler from '../handlers/authentication/UpdatePasswordHandler';
import UpdatePasswordHandler from '../handlers/authentication/UpdatePasswordHandler';

class AuthenticationController {
	async login(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(LoginHandlers).handle(req);
		return res.status(200).json(data);
	}
	async register(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(RegisterHandlers).handle(req);
		return res.status(200).json(data);
	}
	async refreshToken(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(RefreshTokenHandlers).handle(req);
		return res.status(200).json(data);
	}
	async sendEmailForgotPassword(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(SendEmailResetPasswordHandler).handle(req);
		return res.status(200).json(data);
	}
	async udatePassword(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdatePasswordHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AuthenticationController();
