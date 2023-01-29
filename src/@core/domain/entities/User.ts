import Entity from './Entity';
export enum TypeGender {
	Male = 'male',
	Female = 'female',
}
export interface IProps {
	code: string;
	avatar: string;
	phoneNumber: string;
	password: string;
	email: string;
	name: string;
	gender: TypeGender;
	level: string;
	roleId: number;
	createdAt: Date;
	updatedAt: Date;
}
export default class User extends Entity<IProps> {
	static create(props: IProps, id?: number) {
		return new User(props, id);
	}
	get code() {
		return this.props.code;
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
	get level() {
		return this.props.level;
	}
	get roleId() {
		return this.props.roleId;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
}
