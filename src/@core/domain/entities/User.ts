import Entity from './Entity';
import lodash from 'lodash';
export enum TypeRoleUser {
	Student = 'student',
	Lecture = 'lecture',
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
	level?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class User extends Entity<IProps> {
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
	get level() {
		return this.props.level;
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
	get toResponses() {
		const reponse: Partial<IProps> = lodash.cloneDeep(this.props);

		delete reponse['password'];

		return reponse;
	}
}
