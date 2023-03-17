import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
import { TypeDegree, TypeRoleLecturer } from '../entities/Lecturer';
export interface IDegree {
	value: any;
	required?: boolean;
}

export default class RoleLecturer {
	public static validate(props: IDegree) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeRoleLecturer))
			.required();

		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
