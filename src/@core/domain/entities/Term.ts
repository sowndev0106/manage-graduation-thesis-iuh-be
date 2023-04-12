import Entity from './Entity';
import Majors from './Majors';
import lodash from 'lodash';
export interface IProps {
	name: string;
	majors: Majors;
	startDate: Date;
	endDate: Date;
	startDateSubmitTopic: Date;
	endDateSubmitTopic: Date;
	startDateChooseTopic: Date;
	endDateChooseTopic: Date;
	startDateDiscussion: Date;
	endDateDiscussion: Date;
	startDateReport: Date;
	endDateReport: Date;
	isPublicResult: boolean;
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
	get startDateDiscussion() {
		return this.props.startDateDiscussion;
	}
	get endDateDiscussion() {
		return this.props.endDateDiscussion;
	}
	get startDateReport() {
		return this.props.startDateReport;
	}
	get endDateReport() {
		return this.props.endDateReport;
	}
	get isPublicResult() {
		return this.props.isPublicResult;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	updateMajors(majors: Majors) {
		return (this._props.majors = majors);
	}
	get toJSON() {
		const { majors, ...props } = lodash.cloneDeep(this.props);

		return { id: this.id, ...props, majors: majors?.toJSON };
	}
}
