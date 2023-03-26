import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import EvaluationDaoCore from '@core/infrastructure/objection-js/daos/EvaluationDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import { injectable } from 'inversify';

@injectable()
export default class EvaluationDao extends EvaluationDaoCore implements IEvaluationDao {
	async findOne(termId: number, type: TypeEvaluation, name: string): Promise<Evaluation | null> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		if (termId) whereClause['term_id'] = termId;
		if (type) whereClause['type'] = type;
		if (name) whereClause['name'] = name;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(termId?: number, type?: TypeEvaluation): Promise<Evaluation[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		if (termId) whereClause['term_id'] = termId;
		if (type) whereClause['type'] = type;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
