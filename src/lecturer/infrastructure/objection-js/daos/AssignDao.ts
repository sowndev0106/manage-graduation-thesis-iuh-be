import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import AssignDaoCore from '@core/infrastructure/objection-js/daos/AssignDao';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import { injectable } from 'inversify';

@injectable()
export default class AssignDao extends AssignDaoCore implements IAssignDao {
	async findOne(props: { groupLecturerId?: number; type?: TypeEvaluation; groupId?: number }): Promise<Assign | null> {
		const query = this.initQuery();
		query.withGraphFetched('[group_lecturer, group]');
		const whereClause: Record<string, any> = {};

		whereClause['group_lecturer_id'] = props.groupLecturerId;
		whereClause['type_evaluation'] = props.type;
		whereClause['group_id'] = props.groupId;

		query.where(whereClause);

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findOneExtends(props: { termId: number; lecturerId: number; studentId: number; typeEvaluation: TypeEvaluation }): Promise<Assign | null> {
		const query = this.initQuery();

		query.join('group_lecturer', 'group_lecturer.id', '=', 'assign.group_lecturer_id');
		query.join('group_lecturer_member', 'group_lecturer_member.group_lecturer_id', '=', 'group_lecturer.id');

		query.join('group', 'group.id', '=', 'assign.group_id');
		query.join('group_member', 'group_member.group_id', '=', 'group.id');

		const whereClause: Record<string, any> = {};

		whereClause['type_evaluation'] = props.typeEvaluation;
		whereClause['group_lecturer.term_id'] = props.termId;
		whereClause['group_lecturer_member.lecturer_id'] = props.lecturerId;
		whereClause['group_member.student_id'] = props.studentId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findByLecturer(termId: number, lecturerId: number): Promise<Assign[]> {
		const query = this.initQuery();
		query.withGraphFetched('[group_lecturer, group]');
		query.join('group_lecturer', 'group_lecturer.id', '=', 'assign.group_lecturer_id').where({ 'group_lecturer.term_id': termId });

		query
			.join('group_lecturer_member', 'group_lecturer_member.group_lecturer_id', '=', 'group_lecturer.id')
			.where({ 'group_lecturer_member.lecturer_id': lecturerId });

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}

	async findAll(groupLecturerId: number, termId?: number, type?: TypeEvaluation, groupId?: number): Promise<Assign[]> {
		const query = this.initQuery();
		query.withGraphFetched('[group_lecturer, group]');

		const whereClause: Record<string, any> = {};

		if (groupLecturerId) whereClause['group_lecturer_id'] = groupLecturerId;
		if (type) whereClause['type_evaluation'] = type;
		if (groupId) whereClause['group_id'] = groupId;

		if (termId) {
			query.join('group_lecturer', 'group_lecturer.id', '=', 'assign.group_lecturer_id').where({ 'group_lecturer.term_id': termId });
		}
		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
