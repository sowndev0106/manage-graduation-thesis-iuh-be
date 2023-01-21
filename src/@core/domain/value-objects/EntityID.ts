import ValueObject from './ValueObject';

export interface IEntityID {
	value: string;
}

export default class EntityID extends ValueObject<IEntityID> {
	public static create(props: IEntityID) {
		const { value } = props;
		if (value === null || value === undefined || typeof value !== 'string') {
			throw new Error('EntityID is invalid');
		}

		return new EntityID(props);
	}

	get value() {
		return this._props.value;
	}

	public equalTo(id: EntityID) {
		return this._props.value === id._props.value;
	}
}
