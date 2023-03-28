import IDao from '@core/domain/daos/IDao';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';

export default interface IGroupLecturerMemberDao extends IDao<GroupLecturerMember> {
	findOne(groupLecturerId: number, lecturerId: number): Promise<GroupLecturerMember | null>;
	findAll(termId: number, groupLecturerId: number, lecturerId: number): Promise<GroupLecturerMember[]>;
}
