import Group from '@core/domain/entities/Group';
import GroupDaoCore from '@core/infrastructure/objection-js/daos/GroupDao';
import IGroupDao from '@student/domain/daos/IGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupDao extends GroupDaoCore implements IGroupDao {
	async findAll(props: { termId?: number; topicId?: number }): Promise<Group[]> {
		const query = this.initQuery();
		const whereClause: Record<string, number> = {};
		query.withGraphFetched('[topic, members, members.student_term,members.student_term.student]');
		if (props.termId) whereClause['term_id'] = props.termId;
		if (props.topicId) whereClause['topic_id'] = props.topicId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
	async findOne(props: { studentTermId: number }): Promise<Group | null> {
		const query = this.initQuery();
		const whereClause: Record<string, number> = {};
		query.withGraphFetched('[topic, members, members.student_term,members.student_term.student]');
		whereClause['members.student_term_id'] = props.studentTermId;

		query.joinRelated('members').where(whereClause);

		const result = await query.execute();

		return result[0] ? this.convertModelToEntity(result[0]) : null;
	}
}
