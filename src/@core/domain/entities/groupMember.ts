import Entity from './Entity';
import lodash from 'lodash';
import Topic from './Topic';
import Student from './Student';
import Group from './Group';
export interface IProps {
	group: Group;
	student: Student;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class GroupMember extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new GroupMember(props, id);
	}
	static createById(id?: number) {
		return new GroupMember(undefined, id);
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
	updateStudent(student: Student) {
		this._props.student = student;
	}
	updateGroup(group: Group) {
		this._props.group = group;
	}
	get toJSON() {
		const { student, group, ...props } = lodash.cloneDeep(this._props || {});

		let studentProps = this.student?.toJSON;
		let groupProps: any = this.group?.toJSON;

		return { id: this.id, ...props, student: studentProps, group: groupProps };
	}
}
