import Entity from './Entity';
import lodash from 'lodash';
export enum TypeRoleUser {
	Student = 'student',
	Lecturer = 'lecturer',
	Admin = 'admin',
}
export enum TypeGender {
	Male = 'male',
	Female = 'female',
}
export interface IProps {
	username: string;
	password: string;
	majorsId: number;
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
		return this.props.majorsId;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get toJSON() {
		const reponse: Partial<IProps> = lodash.cloneDeep(this.props || {});

		delete reponse['password'];

		return { id: this.id, ...reponse };
	}
}
