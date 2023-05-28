import ValidationError from "@core/domain/errors/ValidationError";
import Joi from "joi";
import { TypeReportGroup } from "../entities/Group";

export interface IEvaluation {
  value: any;
  required?: boolean;
}

export default class TypeReportGroupValidate {
  public static validate(props: IEvaluation) {
    // allow null
    if (props.required == false && !props.value) return props.value;

    const schema = Joi.string()
      .valid(...Object.values(TypeReportGroup))
      .required();
    const { error, value } = schema.validate(props.value);

    if (error) throw new Error(error?.message.replace(/"/g, "").trim());

    return value;
  }
}
