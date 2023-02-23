import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import ImportLecturerByExcelHandler from '../handlers/user/ImportLecturerByExcelHandler';
import GetListLecturer from '../handlers/user/GetListLecturer';

class LecturerController {
	async importLecturerByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportLecturerByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListLecturer).handle(req);
		return res.status(200).json(data);
	}
}

export default new LecturerController();
