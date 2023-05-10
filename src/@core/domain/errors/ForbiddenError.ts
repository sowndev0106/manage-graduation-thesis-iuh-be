import { IKeyErrorCode } from './ErrorCode';

export default class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'FORBIDDEN';
	}
}
