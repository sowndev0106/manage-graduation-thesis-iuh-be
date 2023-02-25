import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
import Term from './Term';
export enum typeStatusTopic {
	Refuse = 'refuse',
	Peding = 'peding',
	Accept = 'accept',
}
export interface IProps {
	name: string;
	quantityGroupMax: number;
	description: string;
	note?: string;
	target: string;
	standradOutput: string;
	requireInput: string;
	comment?: string;
	status: string;
	headLecturer: Lecturer;
	term: Term;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Topic extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Topic(props, id);
	}
	static createById(id?: number) {
		return new Topic(undefined, id);
	}
	get name() {
		return this.props.name;
	}
	get quantityGroupMax() {
		return this.props.quantityGroupMax;
	}
	get description() {
		return this.props.description;
	}
	get note() {
		return this.props.note;
	}
	get target() {
		return this.props.target;
	}
	get standradOutput() {
		return this.props.standradOutput;
	}
	get requireInput() {
		return this.props.requireInput;
	}
	get comment() {
		return this.props.comment;
	}
	get status() {
		return this.props.status;
	}
	get term() {
		return this.props.term;
	}
	get termId() {
		return this.props.term.id;
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
		const { headLecturer, term, ...props } = lodash.cloneDeep(this._props || {});

		let headLecturerProps = headLecturer?.toJSON;
		let termProps = term?.toJSON;

		return { id: this.id, ...props, headLecturer: headLecturerProps, term: termProps };
	}
}
