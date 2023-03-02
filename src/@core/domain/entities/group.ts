import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
import Term from './Term';
import Topic from './Topic';
export interface IProps {
	name?: string;
	term: Term;
	topic: Topic;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Group extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Group(props, id);
	}
	static createById(id?: number) {
		return new Group(undefined, id);
	}
	get name() {
		return this.props.name;
	}
	get termId() {
		return this.props?.term?.id;
	}
	get term() {
		return this.props?.term;
	}
	get topicId() {
		return this.props?.topic?.id;
	}
	get topic() {
		return this.props?.topic;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	updateTopic(topic: Topic) {
		this._props.topic = topic;
	}
	updateTerm(term: Term) {
		this._props.term = term;
	}
	get toJSON() {
		const { term, topic, ...props } = lodash.cloneDeep(this._props || {});

		let termProps = this.term?.toJSON;
		let topicProps = this.topic?.toJSON;

		return { id: this.id, ...props, term: termProps, topic: topicProps };
	}
}
