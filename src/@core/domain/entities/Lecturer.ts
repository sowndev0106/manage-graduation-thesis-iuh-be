import Entity from './Entity';
import User, { IProps as IPropsUSer } from './User';

export interface IProps extends IPropsUSer {
	level: string;
	userId: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export default class Lecturer extends User {
	static create(props: IProps, id?: number) {
		return new Lecturer(props, id);
	}

	get name() {
		return this.props.name;
	}

	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get toJSON() {
		return {
			...super.toJSON,
			name: this.name,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
