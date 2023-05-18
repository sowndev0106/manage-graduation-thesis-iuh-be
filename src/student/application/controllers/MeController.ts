import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetMyInfoHandlers from '../handlers/me/GetMyInfoHandlers';
import UpdateMyInfoHandler from '../handlers/me/UpdateMyInfoHandler';
import UpdateMyPasswordHandler from '../handlers/me/UpdateMyPasswordHandler';
import GetMyNotificationLecturerHandler from '../handlers/me/GetMyNotificationLecturerHandler';
import UpdateStatusNotificationStudentHandler from '../handlers/me/UpdateStatusNotificationLecturerHandler';
import UpdateAllStatusNotificationStudentHandler from '../handlers/me/UpdateAllStatusNotificationLecturerHandler';

class UserController {
	async getMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyInfoHandlers).handle(req);
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
	async getMyNotification(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyNotificationLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async readNotification(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateStatusNotificationStudentHandler).handle(req);
		return res.status(200).json(data);
	}
	async readAllNotification(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateAllStatusNotificationStudentHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new UserController();
