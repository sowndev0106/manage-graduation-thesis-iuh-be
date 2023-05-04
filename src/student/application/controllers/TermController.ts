import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetListTermHandler from '../handlers/term/GetListTermHandler';
import GetTermByIdHandler from '../handlers/term/GetTermByIdHandler';
import GetTermNowHandler from '../handlers/term/GetTermNowHandler';

class TermController {
	async getListTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTermHandler).handle(req);
		return res.status(200).json(data);
	}
	async getTermById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetTermByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async getTermNow(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetTermNowHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new TermController();
