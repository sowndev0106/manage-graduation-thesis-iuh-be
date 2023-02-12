import { TypeRoleUser } from '@core/domain/entities/User';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import { NextFunction, Request, Response } from 'express';
async function lecturerAuthentication(req: Request, res: Response, next: NextFunction) {
	const { id, role } = JWTService.verifyAccessTokenByRequert(req);

	if (role !== TypeRoleUser.Lecturer) throw new AuthorizationError('you can not access to lecturer apis');

	req.headers['id'] = String(id);
	req.headers['role'] = role;

	next();
}
async function adminAuthentication(req: Request, res: Response, next: NextFunction) {
	const { id, role } = JWTService.verifyAccessTokenByRequert(req);

	if (role !== TypeRoleUser.Admin) throw new AuthorizationError('you can not access to admin apis');

	req.headers['id'] = String(id);
	req.headers['role'] = role;

	next();
}

export { lecturerAuthentication, adminAuthentication };
