import Joi from 'joi';
import { isArray, isNumber } from 'lodash';
import { Interface } from 'readline';
export interface IEntityIds {
	value: any;
	required?: boolean;
}
export interface ITranscriptDetail {
	idEvaluation: number;
	grade: number;
}

export default class TranscriptDetails {
	public static validate(props: IEntityIds) {
		// allow null
		if (props.required == false && !props.value) return [];

		let values: ITranscriptDetail[] = [];
		let error = false;
		const uniqueValue = new Map<number, ITranscriptDetail>();

		try {
			values = JSON.parse(props.value);

			if (!isArray(values)) error = true;

			for (const value of values) {
				const idEvaluation = Number(value.idEvaluation);
				const grade = Number(value.grade);
				if (!idEvaluation || !grade) {
					error = true;
					break;
				}
				uniqueValue.set(idEvaluation, { idEvaluation, grade });
			}
		} catch (error) {
			error = true;
		}

		if (error) throw new Error('value must be array type Array<{idEvaluation:number,grade:number}>');

		return Array.from(uniqueValue.values());
	}
}
