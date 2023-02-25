import Entity from './Entity';
import lodash from 'lodash';
import User from './User';

export enum TypeDegree {
	Masters = 'masters',
	Docter = 'doctor',
}
export interface IProps {
	degree: TypeDegree;
	isAdmin: boolean;
	user: User;
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
	get user(): User {
		return this.props.user;
	}

	get userId(): number | undefined {
		return this.props.user.id;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}

	get toJSON() {
		const { user, ...props } = { ...this.props };

		let userProps: any;
		if (user) {
			userProps = user.toJSON;
			delete userProps['id'];
			delete userProps['password'];
		}

		return {
			id: this.id,
			...userProps,
			...props,
		};
	}
	updateDegree(degree: TypeDegree) {
		this._props.degree = degree;
	}
	updateUser(user: User) {
		this._props.user = user;
	}
}
