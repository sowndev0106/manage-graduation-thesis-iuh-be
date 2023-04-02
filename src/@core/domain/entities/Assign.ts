import Entity from './Entity';
import lodash from 'lodash';
import { TypeEvaluation } from './Evaluation';
import Group from './Group';
import GroupLecturer from './GroupLecturer';
export interface IProps {
	typeEvaluation: TypeEvaluation;
	group: Group;
	groupLecturer: GroupLecturer;
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
	get groupLecturerId() {
		return this.props?.groupLecturer?.id;
	}
	get groupLecturer() {
		return this.props?.groupLecturer;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { group, groupLecturer, ...props } = lodash.cloneDeep(this._props || {});
		let groupJSON = this.group?.toJSON;
		let groupLecturerJSON = this.groupLecturer?.toJSON;

		return { id: this.id, ...props, group: groupJSON, groupLecturer: groupLecturerJSON };
	}
}
