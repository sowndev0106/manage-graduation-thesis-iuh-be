export default class HeaderTokenInvalidError extends Error {
	constructor(message: string) {
		super(message);

		this.name = 'HeaderTokenInvalidError';
	}
}
