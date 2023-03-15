import { TypeRoleUser } from '@core/domain/entities/Lecturer';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import { NextFunction, Request, Response } from 'express';
class LecturerAuth {
	async lecturer(req: Request, res: Response, next: NextFunction) {
		const { id, role, isAdmin } = JWTService.verifyAccessTokenByRequert(req);

		if (role !== TypeRoleUser.LECTURER && role !== TypeRoleUser.HEAD_LECTURER) throw new AuthorizationError('you can not permission to lecturer apis');

		req.headers['id'] = String(id);
		req.headers['role'] = role;
		isAdmin ? (req.headers['is_admin'] = 'true') : (req.headers['is_admin'] = 'false');

		next();
	}
	async headLecturer(req: Request, res: Response, next: NextFunction) {
		const { id, role, isAdmin } = JWTService.verifyAccessTokenByRequert(req);

		if (role !== TypeRoleUser.HEAD_LECTURER) throw new AuthorizationError('you can not permission to head lecturer apis');

		req.headers['id'] = String(id);
		req.headers['role'] = role;
		isAdmin ? (req.headers['is_admin'] = 'true') : (req.headers['is_admin'] = 'false');
		next();
	}
	async admin(req: Request, res: Response, next: NextFunction) {
		const { id, role, isAdmin } = JWTService.verifyAccessTokenByRequert(req);

		if (!isAdmin) throw new AuthorizationError('you can not permission to admin apis');

		req.headers['id'] = String(id);
		req.headers['role'] = role;
		req.headers['is_admin'] = 'true';

		next();
	}
}

export default new LecturerAuth();
