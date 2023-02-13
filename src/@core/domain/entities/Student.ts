import Entity from './Entity';
import lodash from 'lodash';
import User from './User';

export enum TypeTraining {
	College = 'college',
	University = 'university',
}
export interface IProps {
	typeTraining?: TypeTraining;
	schoolYear?: string;
	user: User;
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
	get user(): User {
		return this.props.user;
	}

	get userId(): number | undefined {
		return this.props.user.id;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get toJSON() {
		const { user, ...props } = lodash.cloneDeep(this.props);
		let userProps: any = user?.toJSON;
		delete userProps['id'];

		return {
			id: this.id,
			...userProps,
			...props,
		};
	}
	updateUser(user: User) {
		this._props.user = user;
	}
}
