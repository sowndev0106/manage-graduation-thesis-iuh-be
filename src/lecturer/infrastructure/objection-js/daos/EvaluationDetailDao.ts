import EvaluationDetail from '@core/domain/entities/EvaluationDetail';
import EvaluationDetailDaoCore from '@core/infrastructure/objection-js/daos/EvaluationDetailDao';
import IEvaluationDetailDao from '@lecturer/domain/daos/IEvaluationDetailDao';
import { injectable } from 'inversify';

@injectable()
export default class EvaluationDetailDao extends EvaluationDetailDaoCore implements IEvaluationDetailDao {
	async findAll(evaluationId?: number): Promise<EvaluationDetail[]> {
		const query = this.initQuery();

		query.withGraphFetched('evaluation_detail');

		const whereClause: Record<string, any> = {};

		if (evaluationId) whereClause['evaluation_id'] = evaluationId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
