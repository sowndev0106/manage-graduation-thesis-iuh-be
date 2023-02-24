import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import GetMyInfoHandlers from '../handlers/me/GetMyInfoHandler';
import ImportStudentByExcelHandler from '../handlers/student/ImportStudentByExcelHandler';
import ImportLecturerByExcelHandler from '../handlers/lecturer/ImportLecturerByExcelHandler';
import GetListStudent from '../handlers/student/GetListStudent';
import ImportMyStudentByExcelHandler from '../handlers/student/ImportMyStudentByExcelHandler';

class UserController {
	async importStudentByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportStudentByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async importMyStudentByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportMyStudentByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async getStudents(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListStudent).handle(req);
		return res.status(200).json(data);
	}
}

export default new UserController();
