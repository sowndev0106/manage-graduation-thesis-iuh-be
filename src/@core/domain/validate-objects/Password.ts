import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
export interface IPassword {
	value: string;
	required?: boolean;
}

export default class Password {
	public static validate(props: IPassword) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string().required().min(6).max(30);

		const { error, value } = schema.validate(props.value?.trim());

		if (error) throw new Error(error?.message.replace(/"/g, '')?.trim());

		return value;
	}
}
