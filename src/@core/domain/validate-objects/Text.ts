import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
export interface IText {
	value: string;
	required?: boolean;
}

export default class Text {
	public static validate(props: IText) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string().required().max(65535);
		const { error, value } = schema.validate(props.value?.trim());

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
