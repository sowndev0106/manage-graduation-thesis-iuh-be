import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
import GroupLecturer from './GroupLecturer';
export interface IProps {
	groupLecturer: GroupLecturer;
	lecturer: Lecturer;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class GroupLecturerMember extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new GroupLecturerMember(props, id);
	}
	static createById(id?: number) {
		return new GroupLecturerMember(undefined, id);
	}

	get groupLecturerId() {
		return this.props?.groupLecturer?.id;
	}
	get groupLecturer() {
		return this.props?.groupLecturer;
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
	updateLecturer(lecturer: Lecturer) {
		this._props.lecturer = lecturer;
	}
	updateGroup(groupLecturer: GroupLecturer) {
		this._props.groupLecturer = groupLecturer;
	}
	get toJSON() {
		const { lecturer, groupLecturer, ...props } = lodash.cloneDeep(this._props || {});

		let lecturerProps = this.lecturer?.toJSON;
		let groupLecturerProps: any = this.groupLecturer?.toJSON;

		return { id: this.id, ...props, lecturer: lecturerProps, groupLecturer: groupLecturerProps };
	}
}
