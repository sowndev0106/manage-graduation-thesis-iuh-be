import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
import { TypeDegree } from '../entities/Lecturer';
export interface IDegree {
	value: any;
	required?: boolean;
}

export default class Degree {
	public static validate(props: IDegree) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeDegree))
			.required();

		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
