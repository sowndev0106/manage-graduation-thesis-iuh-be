import Entity from './Entity';
import Majors from './Majors';
export interface IProps {
	name: string;
	majors: Majors;
	startDate: Date;
	endDate: Date;
	startDateSubmitTopic: Date;
	endDateSubmitTopic: Date;
	startDateChooseTopic: Date;
	endDateChooseTopic: Date;
	dateDiscussion: Date;
	dateReport: Date;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Term extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Term(props, id);
	}
	static createById(id?: number) {
		return new Term(undefined, id);
	}
	get name() {
		return this.props.name;
	}
	get majors() {
		return this.props.majors;
	}
	get majorsId() {
		return this.props.majors.id;
	}
	get startDate() {
		return this.props.startDate;
	}
	get endDate() {
		return this.props.endDate;
	}
	get startDateSubmitTopic() {
		return this.props.startDateSubmitTopic;
	}
	get endDateSubmitTopic() {
		return this.props.endDateSubmitTopic;
	}
	get startDateChooseTopic() {
		return this.props.startDateChooseTopic;
	}
	get endDateChooseTopic() {
		return this.props.endDateChooseTopic;
	}
	get dateDiscussion() {
		return this.props.dateDiscussion;
	}
	get dateReport() {
		return this.props.dateReport;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	updateMajors(majors: Majors) {
		return (this._props.majors = majors);
	}
}
