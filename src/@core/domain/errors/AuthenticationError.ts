import { IKeyErrorCode } from './ErrorCode';

export default class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AUTHENTICATION';
	}
}
