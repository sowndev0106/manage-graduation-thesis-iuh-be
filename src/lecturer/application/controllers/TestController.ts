import { NextFunction, Request, Response } from 'express';
import Ioc from '@admin/infrastructure/inversify';
import TestHandlers from '../handlers/Test';

export default class TestController {
	async getInput(req: Request, res: Response, next: NextFunction) {
		
		const data =await Ioc.get(TestHandlers).handle(req)

		return res.status(200).json(data);
	}
}
