import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetListAchievementHandler from '../handlers/achievement/GetListAchievementHandler';
import GetAchievementByIdHandler from '../handlers/achievement/GetAchievementByIdHandler';

class AchievementController {
	async getListAchievement(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListAchievementHandler).handle(req);
		return res.status(200).json(data);
	}
	async getAchievementById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetAchievementByIdHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AchievementController();
