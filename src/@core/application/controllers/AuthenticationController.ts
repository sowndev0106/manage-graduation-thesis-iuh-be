import { NextFunction, Request, Response } from 'express';
import Ioc from '@core/infrastructure/inversify';
import LoginHandlers from '../handlers/authentication/Login';

class AuthenticationController {
	async login(req: Request, res: Response, next: NextFunction) {
		
		const data =await Ioc.get(LoginHandlers).handle(req)

		return res.status(200).json(data);
	}
	async signup(req: Request, res: Response, next: NextFunction) {
		
	}
}

export default new AuthenticationController()