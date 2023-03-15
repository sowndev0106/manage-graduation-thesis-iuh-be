import { TypeRoleLecturer, TypeRoleUser } from '@core/domain/entities/Lecturer';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
const secrectAccessKey = process.env.JWT_SECRECT_ACCESS_TOKEN!;
const secrectRefreshKey = process.env.JWT_SECRECT_REFRESH_TOKEN!;

class JWTService {
	signAccessAndRefreshToken(id: number, role: TypeRoleUser | TypeRoleLecturer, isAdmin?: boolean) {
		const accessToken = this.signAccessToken(id, role, isAdmin);
		const refreshToken = this.signRefreshToken(id, role, isAdmin);

		return { accessToken, refreshToken };
	}
	signAccessToken(id: number, role: TypeRoleUser | TypeRoleLecturer, isAdmin?: boolean) {
		const payload = { id, role, isAdmin: isAdmin ? isAdmin : false };
		const options = {
			expiresIn: '1h',
		};
		const token = jwt.sign(payload, secrectAccessKey, options);

		return token;
	}
	signRefreshToken(id: number, role: TypeRoleUser | TypeRoleLecturer, isAdmin?: boolean) {
		const payload = { id, role, isAdmin: isAdmin ? isAdmin : false };
		const options = {
			expiresIn: '1y',
		};
		const token = jwt.sign(payload, secrectRefreshKey, options);

		return token;
	}
	verifyAccessToken(token: string): { id: number; role: TypeRoleUser | TypeRoleLecturer; isAdmin: boolean } {
		var decoded = jwt.verify(token, secrectAccessKey);
		return decoded as any;
	}
	verifyRefrestToken(token: string): { id: number; role: TypeRoleUser | TypeRoleLecturer; isAdmin: boolean } {
		var decoded = jwt.verify(token, secrectRefreshKey);
		return decoded as any;
	}
	verifyAccessTokenByRequert(req: Request) {
		const authorizationToken = req.headers['authorization'];
		if (!authorizationToken) throw new AuthorizationError('missing authorization token');

		const token = authorizationToken.split(' ')[1];
		try {
			const data = this.verifyAccessToken(token);

			return data;
		} catch (error: any) {
			throw new AuthorizationError(error.message);
		}
	}
}

export default new JWTService();
