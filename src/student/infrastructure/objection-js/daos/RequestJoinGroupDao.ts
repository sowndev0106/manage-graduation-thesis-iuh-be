import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupDaoCore from '@core/infrastructure/objection-js/daos/RequestJoinGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class RequestJoinGroupDao extends RequestJoinGroupDaoCore implements IRequestJoinGroupDao {
	async deleteByStudentTerm(props: { studentTermId: number }): Promise<any> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		whereClause['student_term_id'] = props.studentTermId;

		query.where(whereClause);

		const result = query.delete().execute();

		if (!result) {
			throw new Error('Fail to delete entity');
		}

		return result;
	}
	async findAll(props: { studentTermId?: number; type?: TypeRequestJoinGroup; groupId?: number }): Promise<RequestJoinGroup[]> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};
		query.withGraphFetched('[student_term,student_term.student,group]');

		if (props.type) whereClause['type'] = props.type;
		if (props.studentTermId) whereClause['student_term_id'] = props.studentTermId;
		if (props.groupId) whereClause.group_id = props.groupId;

		query.where(whereClause);

		const result = await query.execute();
		return result && result.map(e => this.convertModelToEntity(e));
	}

	async findOneByGroupIdAndStudentTermId(props: { groupId: number; studentTermId: number }): Promise<RequestJoinGroup | null> {
		const query = this.initQuery();
		query.withGraphFetched('[student_term,student_term.student,group]');
		const whereClause: Record<string, number> = {};

		whereClause['group_id'] = props.groupId;
		whereClause['student_term_id'] = props.studentTermId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
}
