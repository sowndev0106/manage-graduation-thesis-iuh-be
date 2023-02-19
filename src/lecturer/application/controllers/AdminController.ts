import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';

class AdminController {
	async addUserByExcel(req: Request, res: Response, next: NextFunction) {}
}

export default new AdminController();
