import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import GetMyInfoHandlers from '../handlers/user/GetMyInfoHandler';
import UpdateMyInfoHandler from '../handlers/user/UpdateMyInfoHandler';

class MeController {
	async getMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyInfoHandlers).handle(req);
		return res.status(200).json(data);
	}
	async updateMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateMyInfoHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new MeController();
