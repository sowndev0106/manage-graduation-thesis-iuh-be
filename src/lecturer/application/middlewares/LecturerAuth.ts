import { TypeRoleUser } from '@core/domain/entities/User';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import { NextFunction, Request, Response } from 'express';
class LecturerAuth {
	async lecturer(req: Request, res: Response, next: NextFunction) {
		const { id, role } = JWTService.verifyAccessTokenByRequert(req);

		if (role !== TypeRoleUser.Lecturer && role !== TypeRoleUser.HeadLecturer && role !== TypeRoleUser.Admin)
			throw new AuthorizationError('you can not permission to lecturer apis');

		req.headers['id'] = String(id);
		req.headers['role'] = role;

		next();
	}
	async headLecturer(req: Request, res: Response, next: NextFunction) {
		const { id, role } = JWTService.verifyAccessTokenByRequert(req);

		if (role !== TypeRoleUser.HeadLecturer && role !== TypeRoleUser.Admin) throw new AuthorizationError('you can not permission to head lecturer apis');

		req.headers['id'] = String(id);
		req.headers['role'] = role;

		next();
	}
	async admin(req: Request, res: Response, next: NextFunction) {
		const { id, role } = JWTService.verifyAccessTokenByRequert(req);

		if (role !== TypeRoleUser.Admin) throw new AuthorizationError('you can not permission to admin apis');

		req.headers['id'] = String(id);
		req.headers['role'] = role;

		next();
	}
}

export default new LecturerAuth();
