import Group from '@core/domain/entities/group';
import GroupDaoCore from '@core/infrastructure/objection-js/daos/GroupDao';
import IGroupDao from '@student/domain/daos/IGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupDao extends GroupDaoCore implements IGroupDao {
	async findAll(term?: number, topic?: number): Promise<Group[]> {
		const query = this.initQuery();
		const whereClause: Record<string, number> = {};

		if (topic) whereClause.topic_id = topic;
		if (term) whereClause.term_id = term;

		query.where(whereClause);
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
