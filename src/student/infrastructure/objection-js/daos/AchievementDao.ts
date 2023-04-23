import Achievement from '@core/domain/entities/Achievement';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import AchievementDaoCore from '@core/infrastructure/objection-js/daos/AchievementDao';
import IAchievementDao from '@student/domain/daos/IAchievementDao';
import { injectable } from 'inversify';

@injectable()
export default class AchievementDao extends AchievementDaoCore implements IAchievementDao {
	async findAll(props: { termId: number; studentId: number }): Promise<Achievement[]> {
		const query = this.initQuery();
		query.withGraphFetched('[student]');

		const whereClause: Record<string, any> = {};

		if (props.termId) whereClause['term_id'] = props.termId;
		if (props.studentId) whereClause['student_id'] = props.studentId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
