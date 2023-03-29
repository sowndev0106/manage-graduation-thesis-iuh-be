import Joi from 'joi';
import { isArray, isNumber } from 'lodash';
export interface IEntityIds {
	value: any;
	required?: boolean;
}

export default class EntityIds {
	public static validate(props: IEntityIds) {
		// allow null
		if (props.required == false && !props.value) return [];
		let values: number[] = [];
		let error = false;
		try {
			values = JSON.parse(props.value);

			if (isArray(values)) error = true;

			for (const value of values) {
				if (!isNumber(value)) {
					error = true;
					break;
				}
			}
		} catch (error) {
			error = true;
		}

		if (error) throw new Error('value must be array number');

		const uniqueValue = new Set(values);
		return Array.from(uniqueValue);
	}
}
