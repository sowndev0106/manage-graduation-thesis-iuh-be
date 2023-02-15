import Entity from './Entity';
import lodash from 'lodash';
export interface IProps {
	name: string;
	headLecturerId: number;
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
	get headLecturerId() {
		return this.props.headLecturerId;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get toJSON() {
		return { id: this.id, ...lodash.cloneDeep(this.props) };
	}
}
