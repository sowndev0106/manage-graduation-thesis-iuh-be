import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import GetMyInfoHandlers from '../handlers/me/GetMyInfoHandler';
import UpdateMyInfoHandler from '../handlers/me/UpdateMyInfoHandler';
import UpdateMyPasswordHandler from '../handlers/me/UpdateMyPasswordHandler';
import GetMyNotificationLecturerHandler from '../handlers/me/GetMyNotificationLecturerHandler';
import UpdateStatusNotificationLecturerHandler from '../handlers/me/UpdateStatusNotificationLecturerHandler';
import UpdateAllStatusNotificationLecturerHandler from '../handlers/me/UpdateAllStatusNotificationLecturerHandler';

class MeController {
	async getMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyInfoHandlers).handle(req);
		return res.status(200).json(data);
	}
	async getMyNotification(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyNotificationLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateMyInfoHandler).handle(req);
		return res.status(200).json(data);
	}

	async updateMyPassword(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateMyPasswordHandler).handle(req);
		return res.status(200).json(data);
	}
	async readNotification(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateStatusNotificationLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async readAllNotification(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateAllStatusNotificationLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new MeController();
