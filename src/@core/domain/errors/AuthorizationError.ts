import { IKeyErrorCode } from './ErrorCode';

export default class AuthorizationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UNAUTHORIZED';
	}
}
