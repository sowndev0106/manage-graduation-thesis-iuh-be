import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import CreateGroupHandler from '../handlers/group/CreateGroupHandler';
import UpdateTermHandler from '../handlers/group/UpdateTermHandler';
import GetMyGroupHandler from '../handlers/group/GetMyGroupHandler';
import GetGroupByIdHandler from '../handlers/group/GetGroupByIdHandler';
import GetListGroupHandler from '../handlers/group/GetListGroupHandler';
import OutGroupHandler from '../handlers/group/OutGroupHandler';

class GroupController {
	async createGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getMyGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getGroupById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetGroupByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateTermHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListGroupHandler).handle(req);
		return res.status(200).json(data);
	}

	async outGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(OutGroupHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new GroupController();
