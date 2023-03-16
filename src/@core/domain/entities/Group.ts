import Entity from './Entity';
import lodash from 'lodash';
import Term from './Term';
import Topic from './Topic';
import GroupMember from './GroupMember';
export interface IProps {
	name: string;
	term: Term;
	topic?: Topic;
	members?: Array<GroupMember>;
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
	get members() {
		return this.props?.members;
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
	updateMembers(members: Array<GroupMember>) {
		this._props.members = members;
	}
	get toJSON() {
		const { term, topic, members, ...props } = lodash.cloneDeep(this._props || {});

		let termJSON = this.term?.toJSON;
		let topicJSON = this.topic?.toJSON;
		let membersJSON = this.members?.map(e => e?.toJSON);

		return { id: this.id, ...props, term: termJSON, topic: topicJSON, members: membersJSON };
	}
}
