import Entity from './Entity';
import lodash from 'lodash';
import Majors from './Majors';
export enum TypeRoleUser {
	Student = 'student',
	Lecturer = 'lecturer',
	HeadLecturer = 'headLecturer',
	Admin = 'admin',
}
export enum TypeGender {
	Male = 'male',
	Female = 'female',
}
export interface IProps {
	username: string;
	password: string;
	majors: Majors;
	avatar?: string;
	phoneNumber?: string;
	email?: string;
	name?: string;
	gender?: TypeGender;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class User extends Entity<IProps> {
	static createById(id: number) {
		return new User(undefined, id);
	}
	static create(props: IProps, id?: number) {
		return new User(props, id);
	}
	get username() {
		return this.props.username;
	}
	get avatar() {
		return this.props.avatar;
	}
	get phoneNumber() {
		return this.props.phoneNumber;
	}
	get password() {
		return this.props.password;
	}
	get email() {
		return this.props.email;
	}
	get name() {
		return this.props.name;
	}
	get gender() {
		return this.props.gender;
	}
	get majorsId() {
		return this.props.majors.id;
	}
	get majors() {
		return this.props.majors.id;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	updateMajors(majors: Majors) {
		this._props.majors = majors;
	}
	get toJSON() {
		const { majors, ...props }: any = lodash.cloneDeep(this.props || {});
		delete props['password'];

		const reponseMajors = { ...majors?.toJSON };
		return { id: this.id, ...props, majors: reponseMajors };
	}
}
