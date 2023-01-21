export default class ValidationError extends Error {
	private _messageBag: object;

	constructor(messageBag: object) {
		super('ValidationError');

		this.name = 'ValidationError';
		this._messageBag = messageBag;
	}

	get messageBag(): any {
		return this._messageBag;
	}
}
