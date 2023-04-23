import Entity from './Entity';
import Majors from './Majors';
import lodash from 'lodash';
import Student from './Student';
import Term from './Term';
export interface IProps {
	name: string;
	student: Student;
	term: Term;
	bonusGrade: number;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Achievement extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Achievement(props, id);
	}
	static createById(id?: number) {
		return new Achievement(undefined, id);
	}
	get name() {
		return this.props.name;
	}
	get student() {
		return this.props.student;
	}
	get studentId() {
		return this.props.student.id;
	}
	get term() {
		return this.props.term;
	}
	get termId() {
		return this.props.term.id;
	}
	get bonusGrade() {
		return this.props.bonusGrade;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { student, term, ...props } = lodash.cloneDeep(this.props);

		return { id: this.id, ...props, student: student?.toJSON, term: term?.toJSON };
	}
}
