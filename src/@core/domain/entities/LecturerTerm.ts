import Entity from './Entity';
import lodash from 'lodash';
import Lecturer, { TypeRoleLecturer } from './Lecturer';
import Term from './Term';
export interface IProps {
	term: Term;
	lecturer: Lecturer;
	role: TypeRoleLecturer;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class LecturerTerm extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new LecturerTerm(props, id);
	}
	static createById(id?: number) {
		return new LecturerTerm(undefined, id);
	}

	get termId() {
		return this.props?.term?.id;
	}
	get term() {
		return this.props?.term;
	}
	get lecturerId() {
		return this.props?.lecturer?.id;
	}
	get lecturer() {
		return this.props?.lecturer;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get role() {
		return this.props?.role;
	}
	updateLecturer(lecturer: Lecturer) {
		this._props.lecturer = lecturer;
	}
	updateterm(term: Term) {
		this._props.term = term;
	}
	get toJSON() {
		const { lecturer, term, ...props } = lodash.cloneDeep(this._props || {});

		let lecturerProps = this.lecturer?.toJSON;
		let termProps: any = this.term?.toJSON;

		return { id: this.id, ...props, lecturer: lecturerProps, term: termProps };
	}
}
