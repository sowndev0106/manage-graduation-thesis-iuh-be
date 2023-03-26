import Entity from './Entity';
import lodash from 'lodash';
import Term from './Term';
export enum TypeEvaluation {
	ADVISOR = 'ADVISOR',
	REVIEWER = 'REVIEWER',
	SESSION_HOST = 'SESSION_HOST',
}
export interface IProps {
	type: TypeEvaluation;
	term: Term;
	name: string;
	description?: string;
	gradeMax: number;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Evaluation extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Evaluation(props, id);
	}
	static createById(id?: number) {
		return new Evaluation(undefined, id);
	}
	get termId() {
		return this.props?.term?.id;
	}
	get term() {
		return this.props?.term;
	}
	get gradeMax() {
		return this.props?.gradeMax;
	}
	get name() {
		return this.props?.name;
	}
	get description() {
		return this.props?.description;
	}

	get type() {
		return this.props?.type;
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

		return { id: this.id, ...props, term: termJSON };
	}
}
