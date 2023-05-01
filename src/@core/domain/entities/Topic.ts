import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
import Term from './Term';
import LecturerTerm from './LecturerTerm';
export enum TypeStatusTopic {
	REFUSE = 'REFUSE',
	PEDING = 'PEDING',
	ACCEPT = 'ACCEPT',
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
	status: TypeStatusTopic;
	lecturerTerm: LecturerTerm;
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
	get lecturerTermId() {
		return this.props?.lecturerTerm?.id;
	}
	get lecturerTerm() {
		return this.props?.lecturerTerm;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	update(props: Partial<IProps>) {
		const updatedProps: IProps = {
			...this.props,
			...props,
			updatedAt: new Date(),
		};
		this._props = updatedProps;
		return this;
	}
	get toJSON() {
		const { lecturerTerm, ...props } = lodash.cloneDeep(this._props || {});

		let lecturerTermProps = lecturerTerm?.toJSON;

		return { id: this.id, ...props, lecturer: lecturerTermProps };
	}
}
