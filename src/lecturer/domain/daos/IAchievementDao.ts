import IDao from '@core/domain/daos/IDao';
import Achievement from '@core/domain/entities/Achievement';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

export default interface IAchievementDao extends IDao<Achievement> {
	findAll(props: { studentTermId: number }): Promise<Achievement[]>;
}
