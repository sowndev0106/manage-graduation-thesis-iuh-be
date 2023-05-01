import IDao from '@core/domain/daos/IDao';
import GroupMember from '@core/domain/entities/GroupMember';

export default interface IGroupMemberDao extends IDao<GroupMember> {
	findByGroupId(props: { groupId: number }): Promise<GroupMember[]>;
	findOne(props: { groupId: number; studentTermId: number }): Promise<GroupMember | null>;
}
