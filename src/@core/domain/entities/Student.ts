import Entity from './Entity';
import { TypeGender } from './Lecturer';
import Majors from './Majors';
export enum TypeTraining {
	COLLEGE = 'COLLEGE',
	UNIVERSITY = 'UNIVERSITY',
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
	typeTraining?: TypeTraining;
	schoolYear?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Student extends Entity<IProps> {
	static createById(id?: number) {
		return new Student(undefined, id);
	}
	static create(props: IProps, id?: number) {
		return new Student(props, id);
	}
	get typeTraining() {
		return this.props.typeTraining;
	}
	get schoolYear() {
		return this.props.schoolYear;
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

	updateTypeTraining(typeTraining: TypeTraining) {
		this._props.typeTraining = typeTraining;
	}
	updateShoolYear(schoolYear: string) {
		this._props.schoolYear = schoolYear;
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
	updateMajors(majors: Majors) {
		this._props.majors = majors;
	}

	get toJSON() {
		const { majors, ...props } = { ...this.props };

		return {
			id: this.id,
			majors: majors?.toJSON,
			...props,
		};
	}
}
