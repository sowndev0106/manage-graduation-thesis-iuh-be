import Entity from './Entity';
import lodash from 'lodash';
import Student from './Student';
import Term from './Term';
export interface IProps {
	term: Term;
	student: Student;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class StudentTerm extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new StudentTerm(props, id);
	}
	static createById(id?: number) {
		return new StudentTerm(undefined, id);
	}

	get termId() {
		return this.props?.term?.id;
	}
	get term() {
		return this.props?.term;
	}
	get studentId() {
		return this.props?.student?.id;
	}
	get student() {
		return this.props?.student;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	updatestudent(student: Student) {
		this._props.student = student;
	}
	updateterm(term: Term) {
		this._props.term = term;
	}
	get toJSON() {
		const { student, term, ...props } = lodash.cloneDeep(this._props || {});

		let studentProps = this.student?.toJSON;
		let termProps: any = this.term?.toJSON;

		// return { id: this.id, ...props, student: studentProps, term: termProps };
		return { ...studentProps, term: termProps };
	}
}
