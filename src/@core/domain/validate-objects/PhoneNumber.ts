import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
export interface IPhoneNumber {
	value: any;
	required?: boolean;
}

export default class PhoneNumber {
	public static validate(props: IPhoneNumber) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string().required().max(255);
		const { error, value } = schema.validate(props.value);
		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
