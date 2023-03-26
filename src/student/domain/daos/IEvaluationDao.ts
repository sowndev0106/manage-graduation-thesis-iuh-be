import IDao from '@core/domain/daos/IDao';
import Evaluation from '@core/domain/entities/Group';

export default interface IEvaluationDao extends IDao<Evaluation> {
	findAll(termId?: number): Promise<Evaluation[]>;
}
