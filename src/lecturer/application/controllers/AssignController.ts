import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateAssignHandler from '../handlers/assign/CreateAssignHandler';
import UpdateAssignHandler from '../handlers/assign/UpdateAssignHandler';
import GetListAssignHandler from '../handlers/assign/GetListAssignHandler';
import GetAssignByIdHandler from '../handlers/assign/GetAssignByIdHandler';
import DeleteAssignHandler from '../handlers/assign/DeleteAssignHandler';

class AssignController {
	async createAssign(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateAssignHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateAssign(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateAssignHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListAssign(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListAssignHandler).handle(req);
		return res.status(200).json(data);
	}
	async getAssignById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetAssignByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteAssign(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteAssignHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AssignController();
