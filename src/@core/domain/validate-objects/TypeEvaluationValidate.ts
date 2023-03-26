import ValidationError from '@core/domain/errors/ValidationError';
import Joi from 'joi';
import { TypeEvaluation } from '../entities/Evaluation';

export interface IEvaluation {
	value: any;
	required?: boolean;
}

export default class TypeEvaluationValidate {
	public static validate(props: IEvaluation) {
		// allow null
		if (props.required == false && !props.value) return props.value;

		const schema = Joi.string()
			.valid(...Object.values(TypeEvaluation))
			.required();
		const { error, value } = schema.validate(props.value);

		if (error) throw new Error(error?.message.replace(/"/g, '').trim());

		return value;
	}
}
