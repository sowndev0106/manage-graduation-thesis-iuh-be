import Joi from 'joi';
import { isArray, isNumber } from 'lodash';
const maxSumGrade = 10;
export interface ITranscriptDetails {
	value: any;
	required?: boolean;
}
export interface ITranscriptDetail {
	idEvaluation: number;
	grade: number;
}

export default class TranscriptDetails {
	public static validate(props: ITranscriptDetails) {
		// allow null
		if (props.required == false && !props.value) return [];

		let values: ITranscriptDetail[] = [];
		let error = false;
		const uniqueValue = new Map<number, ITranscriptDetail>();
		let sumGrade = 0;
		try {
			if (isArray(values)) {
				values = props.value;
			} else {
				values = JSON.parse(props.value);
			}

			for (const value of values) {
				const idEvaluation = Number(value.idEvaluation);
				const grade = Number(value.grade);
				if (isNaN(idEvaluation) || isNaN(grade)) {
					error = true;
					break;
				}
				sumGrade += grade;
				uniqueValue.set(idEvaluation, { idEvaluation, grade });
			}
		} catch (error) {
			console.log(error);
			error = true;
		}
		if (sumGrade > 10) {
			throw new Error("sum grade can't not > 10");
		}
		if (error) throw new Error('value must be array type Array<{idEvaluation:number,grade:number}>');

		return Array.from(uniqueValue.values());
	}
}
