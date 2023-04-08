import Email from '@core/domain/validate-objects/Email';
import { NextFunction, Request, Response } from 'express';

class UserController {
	getFormResetPassword(req: Request, res: Response, next: NextFunction) {
		res.render('formResetPassword');
	}
}
export default new UserController();
