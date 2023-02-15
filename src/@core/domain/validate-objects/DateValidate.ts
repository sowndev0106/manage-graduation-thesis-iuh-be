import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
export interface IDateValidate {
	value: Date;
	required?: boolean;
}
const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
export default class DateValidate {
	public static validate(props: IDateValidate): Date {
		// allow null
		if (props.required == false && !props.value) return props.value;
		const value = String(props.value);

		if (!regex.test(value)) throw new Error('date is format MM-DD-YYYY');

		return new Date(value);
	}
}
