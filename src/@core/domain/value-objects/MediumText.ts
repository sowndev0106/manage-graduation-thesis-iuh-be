import ValidationError from "@core/domain/errors/ValidationError";
import Joi from "joi"
export interface IMediumText {
	value: string;
	required?: boolean;
}

export default class MediumText {
	private static readonly PATTERN = /^.+$/;

	public static  validate(props: IMediumText) {
		// allow null
		if(props.required == false && !props.value) return props.value

		const schema = Joi.string().required()
		
		const  { error, value } =schema.validate(props.value)

		if(error) throw new ValidationError(error)

		return value
	}

}
