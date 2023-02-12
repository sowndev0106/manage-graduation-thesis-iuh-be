import { TypeRoleUser } from '@core/domain/entities/User';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import { NextFunction, Request, Response } from 'express';
async function studentAuthentication(req: Request, res: Response, next: NextFunction) {
	const { id, role } = JWTService.verifyAccessTokenByRequert(req);

	if (role !== TypeRoleUser.Student) throw new AuthorizationError('you can not access to student apis');

	req.headers['id'] = String(id);
	req.headers['role'] = role;

	next();
}

export default studentAuthentication;
