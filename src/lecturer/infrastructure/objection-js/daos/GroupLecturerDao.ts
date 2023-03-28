import GroupLecturer from '@core/domain/entities/GroupLecturer';
import GroupLecturerDaoCore from '@core/infrastructure/objection-js/daos/GroupLecturerDao';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupLecturerDao extends GroupLecturerDaoCore implements IGroupLecturerDao {
	async findOne(termId: number, name: string): Promise<GroupLecturer | null> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		whereClause['term_id'] = termId;
		whereClause['name'] = name;

		query.joinRelated('members');

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(termId: number, name?: string): Promise<GroupLecturer[]> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		if (termId) whereClause['term_id'] = termId;
		if (name) whereClause['name'] = name;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
