import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
import { TypeStatusTopic } from '../entities/Topic';
export interface IStatusTopic {
	value: any;
	required?: boolean;
}

export default class StatusTopic {
	public static validate(props: IStatusTopic) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeStatusTopic))
			.required();

		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
