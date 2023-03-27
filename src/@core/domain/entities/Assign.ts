import Entity from './Entity';
import lodash from 'lodash';
import Evaluation, { TypeEvaluation } from './Evaluation';
import Group from './Group';
import Lecturer from './Lecturer';
export interface IProps {
	typeEvaluation: TypeEvaluation;
	group: Group;
	lecturer: Lecturer;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Assign extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Assign(props, id);
	}
	static createById(id?: number) {
		return new Assign(undefined, id);
	}
	get typeEvaluation() {
		return this.props.typeEvaluation;
	}
	get groupId() {
		return this.props?.group?.id;
	}
	get group() {
		return this.props?.group;
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
	get toJSON() {
		const { group, lecturer, ...props } = lodash.cloneDeep(this._props || {});
		let groupJSON = this.group?.toJSON;
		let lecturerJSON = this.lecturer?.toJSON;

		return { id: this.id, ...props, group: groupJSON, lecturer: lecturerJSON };
	}
}
