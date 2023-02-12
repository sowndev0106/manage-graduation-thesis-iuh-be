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
	get toJSON() {
		const { user, ...props } = lodash.cloneDeep(this.props);
		let userProps: any;
		userProps = user?.toJSON;
		delete userProps['id'];

		return {
			id: this.id,
			...props,
			...userProps,
		};
	}
	updateUser(user: User) {
		this._props.user = user;
	}
}
