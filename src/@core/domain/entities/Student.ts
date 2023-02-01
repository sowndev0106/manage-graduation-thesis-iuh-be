import Entity from './Entity';
import lodash from 'lodash';

enum TypeTraining {
	College = 'college',
	University = 'university',
}
export interface IProps {
	typeTraining: TypeTraining;
	schoolYear: string;
	userId: number;
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
	get userId() {
		return this.props.userId;
	}
	get toResponses() {
		return lodash.cloneDeep(this.props);
	}
}
