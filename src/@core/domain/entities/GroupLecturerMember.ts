import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
import GroupLecturer from './GroupLecturer';
import LecturerTerm from './LecturerTerm';
export interface IProps {
	groupLecturer: GroupLecturer;
	lecturerTerm: LecturerTerm;
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
	get toJSON() {
		const { lecturerTerm, groupLecturer, ...props } = lodash.cloneDeep(this._props || {});

		let lecturerTermProps = this.lecturerTerm?.toJSON;
		let groupLecturerProps: any = this.groupLecturer?.toJSON;

		return { id: this.id, ...props, lecturer: lecturerTermProps, groupLecturer: groupLecturerProps };
	}
}
