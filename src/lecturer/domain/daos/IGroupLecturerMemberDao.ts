import IDao from '@core/domain/daos/IDao';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';

export default interface IGroupLecturerMemberDao extends IDao<GroupLecturerMember> {
	findOne(props: { groupLecturerId: number; lecturerTermId: number }): Promise<GroupLecturerMember | null>;
	findAll(props: { groupLecturerId: number }): Promise<GroupLecturerMember[]>;
}
