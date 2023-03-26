import IDao from '@core/domain/daos/IDao';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';

export default interface IEvaluationDao extends IDao<Evaluation> {
	findAll(termId?: number, type?: TypeEvaluation): Promise<Evaluation[]>;
	findOne(termId: number, type: TypeEvaluation): Promise<Evaluation | null>;
}
