import Entity from './Entity';
export interface IProps {
	name: string;
}
export default class Majors extends Entity<IProps> {
	static create(props: IProps, id?: number) {
		return new Majors(props, id);
	}
	get name() {
		return this.props.name;
	}

}
