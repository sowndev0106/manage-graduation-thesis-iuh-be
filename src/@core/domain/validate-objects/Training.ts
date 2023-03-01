import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
import { TypeTraining } from '../entities/Student';
export interface ITraining {
	value: any;
	required?: boolean;
}

export default class Training {
	public static validate(props: ITraining) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeTraining))
			.required();
		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
