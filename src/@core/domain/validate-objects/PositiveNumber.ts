import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
export interface IPositiveNumber {
	value: any;
	required?: boolean;
}

export default class PositiveNumber {
	public static validate(props: IPositiveNumber) {
		// allow null
		if (props.required == false && !props.value) return Number(props.value);

		const schema = Joi.number().min(0).required();

		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
