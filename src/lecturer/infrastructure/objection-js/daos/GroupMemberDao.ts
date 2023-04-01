import GroupMember from '@core/domain/entities/GroupMember';
import GroupMemberDaoCore from '@core/infrastructure/objection-js/daos/GroupMemberDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupMemberDao extends GroupMemberDaoCore implements IGroupMemberDao {
	async findByGroupId(groupId: number): Promise<GroupMember[]> {
		const query = this.initQuery();
		query.withGraphFetched('[student]');

		const whereClause: Record<string, number> = {};
		whereClause.group_id = groupId;

		query.where(whereClause);
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
