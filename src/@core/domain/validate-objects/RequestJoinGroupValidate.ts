import Joi from 'joi';
import { TypeRequestJoinGroup } from '../entities/RequestJoinGroup';
export interface IRequestJoinGroupValidate {
	value: any;
	required?: boolean;
}

export default class RequestJoinGroupValidate {
	public static validate(props: IRequestJoinGroupValidate) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeRequestJoinGroup))
			.required();

		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
