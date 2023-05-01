import Entity from './Entity';
import lodash from 'lodash';
import Group from './Group';
import StudentTerm from './StudentTerm';
export enum TypeRequestJoinGroup {
	REQUEST_JOIN = 'REQUEST_JOIN',
	REQUEST_INVITE = 'REQUEST_INVITE',
}
export interface IProps {
	message?: string;
	group: Group;
	studentTerm: StudentTerm;
	type: TypeRequestJoinGroup;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class RequestJoinGroup extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new RequestJoinGroup(props, id);
	}
	static createById(id?: number) {
		return new RequestJoinGroup(undefined, id);
	}
	get message() {
		return this.props?.message;
	}
	get type() {
		return this.props?.type;
	}
	get groupId() {
		return this.props?.group?.id;
	}
	get group() {
		return this.props?.group;
	}
	get studentTermId() {
		return this.props?.studentTerm?.id;
	}
	get studentTerm() {
		return this.props?.studentTerm;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}

	get toJSON() {
		const { group, studentTerm, ...props } = lodash.cloneDeep(this._props || {});

		let groupJSON = this.group?.toJSON;
		let studentTermJSON = this.studentTerm?.toJSON;

		return { id: this.id, ...props, group: groupJSON, student: studentTermJSON };
	}
}
