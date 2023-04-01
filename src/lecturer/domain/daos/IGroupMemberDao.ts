import IDao from '@core/domain/daos/IDao';
import GroupMember from '@core/domain/entities/GroupMember';

export default interface IGroupMemberDao extends IDao<GroupMember> {
	findByGroupId(groupId: number): Promise<GroupMember[]>;
}
