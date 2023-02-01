import { TypeRoleUser } from '@core/domain/entities/User';
import AuthorizationError from '@core/domain/errors/AuthorizationError';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
const secrectAccessKey = process.env.JWT_SECRECT_ACCESS_TOKEN!;
const secrectRefreshKey = process.env.JWT_SECRECT_REFRESH_TOKEN!;

function signAccessToken(id: number, role: TypeRoleUser) {
	const payload = { id, role };
	const options = {
		expiresIn: '1h',
	};
	const token = jwt.sign(payload, secrectAccessKey, options);

	return token;
}
function signRefreshToken(id: number, role: TypeRoleUser) {
	const payload = { id, role };
	const options = {
		expiresIn: '1y',
	};
	const token = jwt.sign(payload, secrectRefreshKey, options);

	return token;
}
function verifyAccessToken(token: string): { id: number; role: TypeRoleUser } {
	var decoded = jwt.verify(token, secrectAccessKey);
	return decoded as any;
}
function verifyRefrestToken(token: string): { id: number; role: TypeRoleUser } {
	var decoded = jwt.verify(token, secrectRefreshKey);
	return decoded as any;
}
function verifyAccessTokenByRequert(req: Request) {
	const authorizationToken = req.headers['authorization'];
	if (!authorizationToken) throw new AuthorizationError('missing authorization token');

	const token = authorizationToken.split(' ')[1];
	try {
		const data = verifyAccessToken(token);

		req.headers['id'] = String(data.id);
		req.headers['role'] = data.role;

		return data;
	} catch (error: any) {
		throw new AuthorizationError(error.message);
	}
}

export { signAccessToken, signRefreshToken, verifyAccessToken, verifyAccessTokenByRequert, verifyRefrestToken };
