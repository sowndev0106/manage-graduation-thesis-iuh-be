import GroupMember from '@core/domain/entities/GroupMember';
import GroupMemberDaoCore from '@core/infrastructure/objection-js/daos/GroupMemberDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupMemberDao extends GroupMemberDaoCore implements IGroupMemberDao {
	async findOne(props: { groupId: number; studentTermId: number }): Promise<GroupMember | null> {
		const query = this.initQuery();
		query.withGraphFetched('[student_term,student_term.student]');

		const whereClause: Record<string, number> = {};
		whereClause.group_id = props.groupId;
		whereClause.student_term_id = props.studentTermId;

		query.where(whereClause);

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findByGroupId(props: { groupId: number }): Promise<GroupMember[]> {
		const query = this.initQuery();
		query.withGraphFetched('[student_term, student_term.student]');

		const whereClause: Record<string, number> = {};
		whereClause.group_id = props.groupId;

		query.where(whereClause);
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
