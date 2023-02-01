import Entity from './Entity';
export interface IProps {
	name: string;
	headLecturerId: string;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Majors extends Entity<IProps> {
	static create(props: IProps, id?: number) {
		return new Majors(props, id);
	}

	get name() {
		return this.props.name;
	}
	get headLecturerId() {
		return this.props.headLecturerId;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
}
