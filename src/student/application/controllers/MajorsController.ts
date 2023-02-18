import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import GetListMajorsHandler from '../handlers/majors/GetListMajorsHandler';
import GetMajorsByIdHandler from '../handlers/majors/GetMajorsByIdHandler';

class MajorsController {
	async getListMajors(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListMajorsHandler).handle(req);
		return res.status(200).json(data);
	}
	async getMajorsById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMajorsByIdHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new MajorsController();
