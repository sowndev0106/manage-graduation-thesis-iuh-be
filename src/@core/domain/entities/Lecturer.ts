import Entity from './Entity';
import Majors from './Majors';
export enum TypeGender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
}
export enum TypeDegree {
	MASTERS = 'MASTERS',
	DOCTER = 'DOCTER',
}
export enum TypeRoleLecturer {
	HEAD_LECTURER = 'HEAD_LECTURER',
	LECTURER = 'LECTURER',
	SUB_HEAD_LECTURER = 'SUB_HEAD_LECTURER',
}
export enum TypeRoleUser {
	HEAD_LECTURER = 'HEAD_LECTURER',
	LECTURER = 'LECTURER',
	SUB_HEAD_LECTURER = 'HEAD_LECTURER',
	STUDENT = 'STUDENT',
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
	degree: TypeDegree;
	role: TypeRoleLecturer;
	isAdmin: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Lecturer extends Entity<IProps> {
	static createById(id?: number) {
		return new Lecturer(undefined, id);
	}
	static create(props: IProps, id?: number) {
		return new Lecturer(props, id);
	}
	get degree() {
		return this.props.degree;
	}
	get isAdmin() {
		return this.props.isAdmin;
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
	get role() {
		return this.props.role;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}

	updateDegree(degree: TypeDegree) {
		this._props.degree = degree;
	}
	updateMajors(majors: Majors) {
		this._props.majors = majors;
	}
	updateGender(gender: TypeGender) {
		this._props.gender = gender;
	}
	updateUsername(username: string) {
		this._props.username = username;
	}
	updatePhoneNumber(phoneNumber: string) {
		this._props.phoneNumber = phoneNumber;
	}
	updateAvatar(avatar: string) {
		this._props.avatar = avatar;
	}
	updateEmail(email: string) {
		this._props.email = email;
	}
	updateName(name: string) {
		this._props.name = name;
	}
	get toJSON(): any {
		const { majors, password, ...props } = { ...this.props };

		return {
			id: this.id,
			majors: majors?.toJSON,
			...props,
		};
	}
}
