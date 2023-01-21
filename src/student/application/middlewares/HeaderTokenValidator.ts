import HeaderTokenInvalidError from '@core/domain/errors/HeaderTokenInvalidError';
import { Request, Response, NextFunction } from 'express';

export default (headerKey: string, secretValue: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.headers[headerKey] != secretValue) {
			throw new HeaderTokenInvalidError('Cron api token is invalid');
		}

		next();
	};
};
