import Topic from '@core/domain/entities/Topic';
import TopicDaoCore from '@core/infrastructure/objection-js/daos/TopicDao';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import { injectable } from 'inversify';

@injectable()
export default class TopicDao extends TopicDaoCore implements ITopicDao {
	async findByNameLecturEndTerm(name: string, lecturer: number, term: number): Promise<Topic | null> {
		const query = this.initQuery();

		const result = await query.findOne({ name, lecturer_id: lecturer, term_id: term });

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(term?: number, lecturer?: number): Promise<Topic[]> {
		const query = this.initQuery();
		const whereClause: Record<string, number> = {};

		if (lecturer) whereClause.lecturer_id = lecturer;
		if (term) whereClause.term_id = term;

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
