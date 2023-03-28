import Entity from './Entity';
import lodash from 'lodash';
import Term from './Term';
import GroupLecturerMember from './GroupLecturerMember';
export interface IProps {
	name: string;
	term: Term;
	members?: Array<GroupLecturerMember>;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class GroupLecturer extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new GroupLecturer(props, id);
	}
	static createById(id?: number) {
		return new GroupLecturer(undefined, id);
	}
	get name() {
		return this.props?.name;
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
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { term, ...props } = lodash.cloneDeep(this._props || {});
		let termJSON = this.term?.toJSON;
		let membersJSON = this.members?.map(e => e?.toJSON);

		return { id: this.id, ...props, term: termJSON, members: membersJSON };
	}
}
