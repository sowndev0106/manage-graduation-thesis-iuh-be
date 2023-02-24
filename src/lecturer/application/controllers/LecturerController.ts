import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import ImportLecturerByExcelHandler from '../handlers/lecturer/ImportLecturerByExcelHandler';
import GetListLecturer from '../handlers/lecturer/GetListLecturer';
import ImportMyLecturerByExcelHandler from '../handlers/lecturer/ImportMyLecturerByExcelHandler';

class LecturerController {
	async importLecturerByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportLecturerByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async importMyLecturerByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportMyLecturerByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListLecturer).handle(req);
		return res.status(200).json(data);
	}
}

export default new LecturerController();
