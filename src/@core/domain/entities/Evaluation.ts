import Entity from './Entity';
import lodash from 'lodash';
import Term from './Term';
import EvaluationDetail from './EvaluationDetail';
export enum TypeEvaluation {
	ADVISOR = 'ADVISOR',
	REVIEWER = 'REVIEWER',
	SESSION_HOST = 'SESSION_HOST',
}
export interface IProps {
	type: TypeEvaluation;
	term: Term;
	details?: Array<EvaluationDetail>;
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
	get details() {
		return this.props?.details;
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
	get sumGradeMax() {
		const sum = this.details?.reduce((sum, detail) => sum + detail.gradeMax, 0);
		return sum || 0;
	}
	get toJSON() {
		const { term, details, ...props } = lodash.cloneDeep(this._props || {});

		let termJSON = this.term?.toJSON;
		let detailsJSON = this.details?.map(e => e?.toJSON);

		return { id: this.id, ...props, term: termJSON, details: detailsJSON };
	}
}
