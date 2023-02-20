import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import GetMyInfoHandlers from '../handlers/user/GetMyInfoHandler';
import ImportStudentByExcelHandler from '../handlers/user/ImportStudentByExcelHandler';
import ImportLecturerByExcelHandler from '../handlers/user/ImportLecturerByExcelHandler';

class UserController {
	async getMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyInfoHandlers).handle(req);
		return res.status(200).json(data);
	}
	async importStudentByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportStudentByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async importLecturerByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportLecturerByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateMyInfo(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyInfoHandlers).handle(req);
		return res.status(200).json(data);
	}
}

export default new UserController();
