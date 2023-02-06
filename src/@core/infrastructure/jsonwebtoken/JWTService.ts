import { TypeRoleUser } from '@core/domain/entities/User';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
const secrectAccessKey = process.env.JWT_SECRECT_ACCESS_TOKEN!;
const secrectRefreshKey = process.env.JWT_SECRECT_REFRESH_TOKEN!;

class JWTService {
	signAccessAndRefreshToken(id: number, role: TypeRoleUser) {
		const accessToken = this.signAccessToken(id, role);
		const refreshToken = this.signRefreshToken(id, role);

		return { accessToken, refreshToken };
	}
	signAccessToken(id: number, role: TypeRoleUser) {
		const payload = { id, role };
		const options = {
			expiresIn: '1h',
		};
		const token = jwt.sign(payload, secrectAccessKey, options);

		return token;
	}
	signRefreshToken(id: number, role: TypeRoleUser) {
		const payload = { id, role };
		const options = {
			expiresIn: '1y',
		};
		const token = jwt.sign(payload, secrectRefreshKey, options);

		return token;
	}
	verifyAccessToken(token: string): { id: number; role: TypeRoleUser } {
		var decoded = jwt.verify(token, secrectAccessKey);
		return decoded as any;
	}
	verifyRefrestToken(token: string): { id: number; role: TypeRoleUser } {
		var decoded = jwt.verify(token, secrectRefreshKey);
		return decoded as any;
	}
	verifyAccessTokenByRequert(req: Request) {
		const authorizationToken = req.headers['authorization'];
		if (!authorizationToken) throw new AuthorizationError('missing authorization token');

		const token = authorizationToken.split(' ')[1];
		try {
			const data = this.verifyAccessToken(token);

			req.headers['id'] = String(data.id);
			req.headers['role'] = data.role;

			return data;
		} catch (error: any) {
			throw new AuthorizationError(error.message);
		}
	}
}

export default new JWTService();
