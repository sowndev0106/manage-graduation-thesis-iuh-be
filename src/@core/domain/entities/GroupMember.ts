import Entity from './Entity';
import lodash from 'lodash';
import Topic from './Topic';
import StudentTerm from './StudentTerm';
import Group from './Group';
export interface IProps {
	group: Group;
	studentTerm: StudentTerm;
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
	updateStudentTerm(studentTerm: StudentTerm) {
		this._props.studentTerm = studentTerm;
	}
	updateGroup(group: Group) {
		this._props.group = group;
	}
	get toJSON() {
		const { studentTerm, group, ...props } = lodash.cloneDeep(this._props || {});

		let studentTermProps = this.studentTerm?.toJSON;
		let groupProps: any = this.group?.toJSON;

		return { id: this.id, ...props, student: studentTermProps, group: groupProps };
	}
}
