import ErrorCode, { ErrorCodeDefine, IKeyErrorCode } from '@core/domain/errors/ErrorCode';
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
	console.log('Error stack: ', err.stack);

	// default	error message
	const error: any = {
		code: 'UNKNOWN',
		success: false,
		error: err.message,
	};

	const errorCodeInfo = ErrorCodeDefine[err.name];

	if (errorCodeInfo) {
		error.code = errorCodeInfo.key;
		res.status(errorCodeInfo.statusCode);
	} else {
		res.status(400);
	}

	// special case (validate)
	if ((err as any).messageBag) {
		error.error = (err as any).messageBag;
	}
	return res.json(error);
}
