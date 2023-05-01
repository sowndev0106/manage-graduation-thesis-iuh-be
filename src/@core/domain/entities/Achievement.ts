import Entity from './Entity';
import Majors from './Majors';
import lodash from 'lodash';
import Student from './Student';
import Term from './Term';
import StudentTerm from './StudentTerm';
export interface IProps {
	name: string;
	studentTerm: StudentTerm;
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
	get studentTerm() {
		return this.props.studentTerm;
	}
	get studentTermId() {
		return this.props.studentTerm.id;
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
		const { studentTerm, ...props } = lodash.cloneDeep(this.props);

		return { id: this.id, ...props, student: studentTerm?.toJSON };
	}
}
