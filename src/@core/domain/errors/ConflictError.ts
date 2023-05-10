import { IKeyErrorCode } from './ErrorCode';

export default class ConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CONFLICT';
	}
}
