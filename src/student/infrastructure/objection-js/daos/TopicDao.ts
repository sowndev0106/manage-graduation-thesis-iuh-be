import Topic from '@core/domain/entities/Topic';
import TopicDaoCore from '@core/infrastructure/objection-js/daos/TopicDao';
import ITopicDao from '@student/domain/daos/ITopicDao';
import { injectable } from 'inversify';

@injectable()
export default class TopicDao extends TopicDaoCore implements ITopicDao {
	async findOne(props: { name: string; lecturerTermId: number }): Promise<Topic | null> {
		const query = this.initQuery();
		query.withGraphFetched('[lecturer_term,lecturer_term.lecturer]');
		const whereClause: Record<string, any> = {};

		whereClause.lecturer_term_id = props.lecturerTermId;
		whereClause.name = props.name;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(props: { lecturerTermId?: number; termId?: number }): Promise<Topic[]> {
		const query = this.initQuery();
		query.withGraphFetched('[lecturer_term,lecturer_term.lecturer]');

		const whereClause: Record<string, number> = {};
		if (props.lecturerTermId) whereClause.lecturer_term_id = props.lecturerTermId;
		if (props.termId) {
			query.join('lecturer_term', 'lecturer_term.id', '=', 'topic.lecturer_term_id');
			whereClause['lecturer_term.term_id'] = props.termId;
		}
		query.where(whereClause);
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
