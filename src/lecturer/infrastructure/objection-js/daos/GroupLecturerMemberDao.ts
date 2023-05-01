import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import GroupLecturerMemberDaoCore from '@core/infrastructure/objection-js/daos/GroupLecturerMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupLecturerMemberDao extends GroupLecturerMemberDaoCore implements IGroupLecturerMemberDao {
	async findOne(props: { groupLecturerId: number; lecturerTermId: number }): Promise<GroupLecturerMember | null> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		query.withGraphFetched('[lecturer_term, lecturer_term.lecturer]');

		whereClause['group_lecturer_id'] = props.groupLecturerId;
		whereClause['lecturer_term_id'] = props.lecturerTermId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(props: { groupLecturerId: number }): Promise<GroupLecturerMember[]> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};
		query.withGraphFetched('[lecturer_term, lecturer_term.lecturer]');
		whereClause['group_lecturer_id'] = props.groupLecturerId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
