import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import GroupLecturerMemberDaoCore from '@core/infrastructure/objection-js/daos/GroupLecturerMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupLecturerMemberDao extends GroupLecturerMemberDaoCore implements IGroupLecturerMemberDao {
	async findOne(groupLecturerId: number, lecturerId: number): Promise<GroupLecturerMember | null> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		whereClause['group_lecturer_id'] = groupLecturerId;
		whereClause['lecturer_id'] = lecturerId;

		query.joinRelated('members');

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(termId: number, groupLecturerId: number, lecturerId: number): Promise<GroupLecturerMember[]> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		if (termId) whereClause['term_id'] = termId;
		whereClause['group_lecturer_id'] = groupLecturerId;
		whereClause['lecturer_id'] = lecturerId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
