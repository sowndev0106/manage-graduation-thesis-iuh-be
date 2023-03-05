import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateGroupHandler from '../handlers/group/CreateGroupHandler';
import UpdateTermHandler from '../handlers/group/UpdateTermHandler';
import GetListTermHandler from '../handlers/group/GetListTermHandler';
import GetTermByIdHandler from '../handlers/group/GetTermByIdHandler';
import DeleteTermHandler from '../handlers/group/DeleteTermHandler';

class GroupController {
	async createGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateTermHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTermHandler).handle(req);
		return res.status(200).json(data);
	}
	async getTermById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetTermByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteTermHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new GroupController();
