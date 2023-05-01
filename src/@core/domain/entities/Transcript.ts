import Entity from './Entity';
import lodash from 'lodash';
import Evaluation from './Evaluation';
import Assign from './Assign';
import StudentTerm from './StudentTerm';
import LecturerTerm from './LecturerTerm';
export interface IProps {
	grade: number;
	studentTerm: StudentTerm;
	lecturerTerm: LecturerTerm;
	evaluation: Evaluation;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Transcript extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Transcript(props, id);
	}
	static createById(id?: number) {
		return new Transcript(undefined, id);
	}
	get grade() {
		return this.props.grade;
	}
	get studentTermId() {
		return this.props?.studentTerm?.id;
	}
	get studentTerm() {
		return this.props?.studentTerm;
	}
	get lecturerTermId() {
		return this.props?.lecturerTerm?.id;
	}
	get lecturerTerm() {
		return this.props?.lecturerTerm;
	}
	get evaluationId() {
		return this.props?.evaluation?.id;
	}
	get evaluation() {
		return this.props?.evaluation;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { studentTerm, lecturerTerm, ...props } = lodash.cloneDeep(this._props || {});
		let studentTermJSON = this.studentTerm?.toJSON;
		let lecturerTermJSON = this.lecturerTerm?.toJSON;
		let evaluationJSON = this.evaluation?.toJSON;

		return { id: this.id, ...props, student: studentTermJSON, lecturer: lecturerTermJSON, evaluation: evaluationJSON };
	}
}
