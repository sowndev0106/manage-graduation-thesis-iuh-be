import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import LoginHandlers from '../handlers/authentication/LoginHandlers';
import RegisterHandlers from '../handlers/authentication/RegisterHandlers';
import RefreshTokenHandlers from '../handlers/authentication/RefreshTokenHandlers';
import SendEmailResetPasswordHandler from '../handlers/authentication/SendEmailResetPasswordHandler';

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
	async sendEmailResetPassword(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(SendEmailResetPasswordHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AuthenticationController();
