import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
export interface IDateValidate {
	value: Date;
	required?: boolean;
}

export default class DateValidate {
	public static validate(props: IDateValidate) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.date().required();

		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
