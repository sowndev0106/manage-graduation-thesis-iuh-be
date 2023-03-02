import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetListStudent from '../handlers/student/GetListStudent';
import GetStudentById from '../handlers/student/GetStudentById';

class StudentController {
	async getListStudent(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListStudent).handle(req);
		return res.status(200).json(data);
	}
	async getStudentById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetStudentById).handle(req);
		return res.status(200).json(data);
	}
}

export default new StudentController();
