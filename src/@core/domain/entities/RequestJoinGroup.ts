import Entity from './Entity';
import lodash from 'lodash';
import Group from './Group';
import Student from './Student';
export enum TypeRequestJoinGroup {
	REQUEST_JOIN = 'REQUEST_JOIN',
	REQUEST_INVITE = 'REQUEST_INVITE',
}
export interface IProps {
	message?: string;
	group: Group;
	student: Student;
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
	updateMessage(message: string) {
		this._props.message = message;
		this._props.updatedAt = new Date();
	}
	updateGroup(group: Group) {
		this._props.group = group;
	}
	updateStudent(student: Student) {
		this._props.student = student;
	}
	updateType(type: TypeRequestJoinGroup) {
		this._props.type = type;
	}

	get toJSON() {
		const { group, student, ...props } = lodash.cloneDeep(this._props || {});

		let groupJSON = this.group?.toJSON;
		let studentJSON = this.student?.toJSON;

		return { id: this.id, ...props, group: groupJSON, student: studentJSON };
	}
}
