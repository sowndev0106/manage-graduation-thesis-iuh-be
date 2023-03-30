import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import AssignDaoCore from '@core/infrastructure/objection-js/daos/AssignDao';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import { injectable } from 'inversify';

@injectable()
export default class AssignDao extends AssignDaoCore implements IAssignDao {
	async findOne(groupLecturerId: number, type: TypeEvaluation, groupId: number): Promise<Assign | null> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['group_lecturer_id'] = groupLecturerId;
		whereClause['type_evaluation'] = type;
		whereClause['group_id'] = groupId;

		query.where(whereClause);

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(groupLecturerId: number, termId?: number, type?: TypeEvaluation, groupId?: number): Promise<Assign[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		if (groupLecturerId) whereClause['group_lecturer_id'] = groupLecturerId;
		if (type) whereClause['type_evaluation'] = type;
		if (groupId) whereClause['group_id'] = groupId;

		if (termId) {
			query.join('group', 'group.id', '=', 'assign.group_id').where({ 'group.term_id': termId });
		}
		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
