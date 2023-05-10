import { IKeyErrorCode } from './ErrorCode';

export default class ValidationError extends Error {
	private _messageBag: object | string;

	constructor(messageBag: object | string) {
		super('VALIDATE');
		this.name = 'VALIDATE';
		this._messageBag = messageBag;
	}

	get messageBag(): any {
		return this._messageBag;
	}
}
