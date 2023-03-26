import IDao from '@core/domain/daos/IDao';
import EvaluationDetail from '@core/domain/entities/EvaluationDetail';

export default interface IEvaluationDetailDao extends IDao<EvaluationDetail> {
	findAll(evaluationId?: number): Promise<EvaluationDetail[]>;
}
