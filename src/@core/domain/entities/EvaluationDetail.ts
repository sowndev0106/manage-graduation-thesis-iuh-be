import Entity from './Entity';
import lodash from 'lodash';
import Evaluation from './Evaluation';
export interface IProps {
	name: string;
	evaluation: Evaluation;
	gradeMax: number;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class EvaluationDetail extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new EvaluationDetail(props, id);
	}
	static createById(id?: number) {
		return new EvaluationDetail(undefined, id);
	}

	get evaluationId() {
		return this.props?.evaluation?.id;
	}
	get evaluation() {
		return this.props?.evaluation;
	}
	get gradeMax() {
		return this.props?.gradeMax;
	}
	get name() {
		return this.props?.name;
	}

	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}

	get toJSON() {
		const { evaluation, ...props } = lodash.cloneDeep(this._props || {});

		let evaluationProps: any = this.evaluation?.toJSON;

		return { id: this.id, ...props, evaluation: evaluationProps };
	}
}
