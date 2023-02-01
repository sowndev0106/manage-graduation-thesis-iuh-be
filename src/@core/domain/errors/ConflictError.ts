export default class ConflictError extends Error {
	private _messageBag: object | string;

	constructor(messageBag: object | string) {
		super('ConflictError');

		this.name = 'ConflictError';

		if (typeof messageBag == 'string') this.message = messageBag;

		this._messageBag = messageBag;
	}

	get messageBag(): any {
		return this._messageBag;
	}
}
