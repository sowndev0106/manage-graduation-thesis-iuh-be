import Group from '@core/domain/entities/Group';
import GroupDaoCore from '@core/infrastructure/objection-js/daos/GroupDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupDao extends GroupDaoCore implements IGroupDao {
	async findAll(termId?: number, topicId?: number): Promise<Group[]> {
		const query = this.initQuery();

		query.withGraphFetched('[members, members.student_term, members.student_term.student, topic]');

		const whereClause: Record<string, number> = {};

		if (termId) whereClause['term_id'] = termId;
		if (topicId) whereClause['topic_id'] = topicId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
	async findOneByTermAndStudent(termId: number, studentId: number): Promise<Group | null> {
		const query = this.initQuery();

		query.withGraphFetched('[members, members.student_term, members.student_term.student, topic]');

		const whereClause: Record<string, number> = {};

		whereClause['term_id'] = termId;
		whereClause['members.student_term_id'] = studentId;

		query.joinRelated('members').where(whereClause);

		const result = await query.execute();

		return result[0] ? this.convertModelToEntity(result[0]) : null;
	}
}
