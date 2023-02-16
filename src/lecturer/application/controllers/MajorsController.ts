import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateMajorsHandler from '../handlers/majors/CreateMajorsHandler';
import UpdateMajorsHandler from '../handlers/majors/UpdateMajorsHandler';
import GetListMajorsHandler from '../handlers/majors/GetListMajorsHandler';
import GetMajorsByIdHandler from '../handlers/majors/GetMajorsByIdHandler';
import DeleteMajorsHandler from '../handlers/majors/DeleteMajorsHandler';

class MajorsController {
	async createMajors(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateMajorsHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateMajors(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateMajorsHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListMajors(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListMajorsHandler).handle(req);
		return res.status(200).json(data);
	}
	async getMajorsById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMajorsByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteMajors(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteMajorsHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new MajorsController();
