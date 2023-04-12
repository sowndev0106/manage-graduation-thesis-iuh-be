import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetGroupByIdHandler from '../handlers/group/GetGroupByIdHandler';
import GetListGroupHandler from '../handlers/group/GetListGroupHandler';

class GroupController {
	async getGroupById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetGroupByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListGroupHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new GroupController();
