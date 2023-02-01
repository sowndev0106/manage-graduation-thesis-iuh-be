import ValidationError from '@core/domain/errors/ValidationError';
import { NextFunction, Request, Response } from 'express';

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
	// console.log('ERROR LOG', new Date());
	// console.log('======================================================================');
	// console.log('Request:', req.method, req.originalUrl);
	// console.log('Params:', req.params);
	// console.log('Body:', req.body);
	// console.log('Query:', req.query);
	// console.log('Error: ', err);
	// console.log('Error stack: ', err.stack);

	const error: any = {
		success: false,
		error: err.message,
	};

	switch (err.name) {
		case 'UnauthorizedError':
			res.status(401);
			break;

		case 'NotFoundError':
			res.status(404);
			break;

		case 'HeaderTokenInvalidError':
			res.status(403);
			break;

		case 'ValidationError':
			res.status(422);
			error.error = (err as ValidationError).messageBag;
			break;

		case 'ConflictError':
			res.status(409);
			break;

		default:
			res.status(400);
	}

	return res.json(error);
}
