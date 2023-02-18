import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import GetListTermHandler from '../handlers/term/GetListTermHandler';
import GetTermByIdHandler from '../handlers/term/GetTermByIdHandler';

class TermController {
	async getListTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTermHandler).handle(req);
		return res.status(200).json(data);
	}
	async getTermById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetTermByIdHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new TermController();