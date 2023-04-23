import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateAchievementHandler from '../handlers/achievement/CreateAchievementHandler';
import UpdateAchievementHandler from '../handlers/achievement/UpdateAchievementHandler';
import GetListAchievementHandler from '../handlers/achievement/GetListAchievementHandler';
import GetAchievementByIdHandler from '../handlers/achievement/GetAchievementByIdHandler';
import DeleteAchievementHandler from '../handlers/achievement/DeleteAchievementHandler';

class AchievementController {
	async createAchievement(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateAchievementHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateAchievement(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateAchievementHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListAchievement(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListAchievementHandler).handle(req);
		return res.status(200).json(data);
	}
	async getAchievementById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetAchievementByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteAchievement(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteAchievementHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AchievementController();
