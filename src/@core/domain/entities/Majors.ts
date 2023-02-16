import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
export interface IProps {
	name: string;
	headLecturer?: Lecturer;
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
		return this.props?.headLecturer?.id;
	}
	get headLecturer() {
		return this.props?.headLecturer;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	updateheadLecturer(headLecturer: Lecturer) {
		this._props.headLecturer = headLecturer;
	}
	get toJSON() {
		// const { headLecturer, ...props } = lodash.cloneDeep(this.props);

		// let headLecturerProps: any = headLecturer?.toJSON;

		// return { id: this.id, ...props };
		return '';
	}
}
