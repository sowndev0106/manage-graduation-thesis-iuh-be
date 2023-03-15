import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
export interface IProps {
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Majors extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Majors(props, id);
	}
	static createById(id?: number) {
		return new Majors(undefined, id);
	}
	get name() {
		return this.props.name;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { ...props } = lodash.cloneDeep(this._props || {});

		return { id: this.id, ...props };
	}
}
