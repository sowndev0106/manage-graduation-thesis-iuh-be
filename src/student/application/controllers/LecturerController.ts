import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetListLecturer from '../handlers/lecturer/GetListLecturer';
import GetLecturerById from '../handlers/lecturer/GetLecturerById';

class LecturerController {
	async getListLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListLecturer).handle(req);
		return res.status(200).json(data);
	}
	async getLecturerById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetLecturerById).handle(req);
		return res.status(200).json(data);
	}
}

export default new LecturerController();
