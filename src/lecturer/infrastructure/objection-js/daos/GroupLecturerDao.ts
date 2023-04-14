import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import GroupLecturerDaoCore from '@core/infrastructure/objection-js/daos/GroupLecturerDao';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupLecturerDao extends GroupLecturerDaoCore implements IGroupLecturerDao {
	async findOne(props: { termId: number; name?: string; typeEvaluation?: TypeEvaluation; groupId?: number }): Promise<GroupLecturer | null> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		whereClause['term_id'] = props.termId;
		if (props.termId) whereClause['term_id'] = props.termId;
		if (props.name) whereClause['name'] = props.termId;

		query.withGraphFetched('[members, members.lecturer]');

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(props: {
		termId: number;
		name?: string;
		assign: {
			groupStudentId: number;
			typeEvaluation: TypeEvaluation;
		};
	}): Promise<GroupLecturer[]> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		if (props.termId) whereClause['term_id'] = props.termId;
		if (props.name) whereClause['name'] = props.name;

		if (props.assign.groupStudentId) {
			query.rightJoin('assign', 'assign.group_lecturer_id', '=', 'group_lecturer.id');
			query.where('assign.group_id', '=', props.assign.groupStudentId);
			query.where('assign.type_evaluation', '=', props.assign.typeEvaluation);
		}

		query.where(whereClause);

		query.withGraphFetched('[members, members.lecturer]');

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
