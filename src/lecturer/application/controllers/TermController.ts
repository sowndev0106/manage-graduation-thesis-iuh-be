import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import TestHandlers from '../handlers/Test';
import CreateTermHandlers from '../handlers/term/CreateTermHandlers';

class TermController {
	async createTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateTermHandlers).handle(req);
		return res.status(200).json(data);
	}
	async updateTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(TestHandlers).handle(req);
		return res.status(200).json(data);
	}
	async getListTerm(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(TestHandlers).handle(req);
		return res.status(200).json(data);
	}
	async getTermById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(TestHandlers).handle(req);
		return res.status(200).json(data);
	}
}
export default new TermController();
