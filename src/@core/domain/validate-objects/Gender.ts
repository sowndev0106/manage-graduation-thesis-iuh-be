import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
import { TypeGender } from '../entities/User';
export interface IGender {
	value: any;
	required?: boolean;
}

export default class Gender {
	public static validate(props: IGender) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeGender))
			.required();
		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
