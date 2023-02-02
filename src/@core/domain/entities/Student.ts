import Entity from './Entity';
import lodash from 'lodash';
import User from './User';

enum TypeTraining {
	College = 'college',
	University = 'university',
}
export interface IProps {
	typeTraining: TypeTraining;
	schoolYear: string;
	user: number | User;
}
export default class Student extends Entity<IProps> {
	static create(props: IProps, id?: number) {
		return new Student(props, id);
	}
	get typeTraining() {
		return this.props.typeTraining;
	}
	get schoolYear() {
		return this.props.schoolYear;
	}
	get user() {
		return this.props.user;
	}
	get userId(): number {
		if (this.props.user instanceof User) {
			return this.props.user.id!;
		}
		return this.props.user;
	}
	get toResponses() {
		const { user, ...props } = lodash.cloneDeep(this.props);
		let userProps: any;
		if (user instanceof User) {
			userProps = user.toResponses;
			delete userProps['id'];
		} else {
			userProps = { userId: user };
		}
		return {
			id: this.id,
			...props,
			...userProps,
		};
	}
}
