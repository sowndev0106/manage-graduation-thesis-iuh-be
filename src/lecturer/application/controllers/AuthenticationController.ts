import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import LoginHandler from '../handlers/authentication/LoginHandler';
import RegisterHandler from '../handlers/authentication/RegisterHandler';
import RefreshTokenHandler from '../handlers/authentication/RefreshTokenHandler';

class AuthenticationController {
	async login(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(LoginHandler).handle(req);
		return res.status(200).json(data);
	}
	async register(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(RegisterHandler).handle(req);
		return res.status(200).json(data);
	}
	async refreshToken(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(RefreshTokenHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AuthenticationController();
