import { IKeyErrorCode } from './ErrorCode';

export default class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NOT_FOUND';
	}
}
