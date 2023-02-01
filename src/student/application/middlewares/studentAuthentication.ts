import { TypeRoleUser } from '@core/domain/entities/User';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import { verifyAccessTokenByRequert } from '@core/infrastructure/jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
async function studentAuthentication(req: Request, res: Response, next: NextFunction) {
	const { id, role } = verifyAccessTokenByRequert(req);

	if (role !== TypeRoleUser.Student) throw new AuthorizationError('you can not access to student apis');

	next();
}

export default studentAuthentication;
