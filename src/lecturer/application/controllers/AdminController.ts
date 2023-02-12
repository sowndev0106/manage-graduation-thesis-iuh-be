import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import AddUserByExcelHandler from '../handlers/admin/AddUserByExcelHandler';

class AdminController {
	async addUserByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(AddUserByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new AdminController();
