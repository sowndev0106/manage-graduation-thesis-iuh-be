import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import AssignDaoCore from '@core/infrastructure/objection-js/daos/AssignDao';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import { injectable } from 'inversify';

@injectable()
export default class AssignDao extends AssignDaoCore implements IAssignDao {
	async isFinishTranscript(props: { groupLecturerId: number; groupId: number; type: TypeEvaluation }): Promise<boolean> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		// query.join('evaluation', 'transcript.evaluation_id', '=', 'evaluation.id');

		// query.join('student_term', 'transcript.student_term_id', '=', 'student_term.id');

		// // query.join('group_member', 'group_member.student_term_id', '=', 'student_term.id');

		// query.join('group_lecturer_member', 'group_lecturer_member.student_term_id', '=', 'student_term.id');

		// query.join('assign', 'assign.group_id', '=', 'group_member.group_id');

		// whereClause['evaluation.type'] = props.type;
		// whereClause['group_member.group_id'] = props.groupId;

		query.where(whereClause);

		const result = await query.execute();

		return true;
	}
	async findOne(props: { groupLecturerId?: number; type?: TypeEvaluation; groupId?: number }): Promise<Assign | null> {
		const query = this.initQuery();
		query.withGraphFetched('[group_lecturer, group]');
		const whereClause: Record<string, any> = {};

		if (props.groupLecturerId) whereClause['group_lecturer_id'] = props.groupLecturerId;
		if (props.type) whereClause['type_evaluation'] = props.type;
		if (props.groupId) whereClause['group_id'] = props.groupId;

		query.where(whereClause);

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findOneExtends(props: { lecturerTermId: number; studentTermId: number; typeEvaluation: TypeEvaluation }): Promise<Assign | null> {
		const query = this.initQuery();
		query.withGraphFetched(
			'[group_lecturer, group_lecturer.members,group_lecturer.members.lecturer_term, group_lecturer.members.lecturer_term.lecturer, group, group.members]'
		);

		query.join('group_lecturer', 'group_lecturer.id', '=', 'assign.group_lecturer_id');
		query.join('group_lecturer_member', 'group_lecturer_member.group_lecturer_id', '=', 'group_lecturer.id');

		query.join('group', 'group.id', '=', 'assign.group_id');
		query.join('group_member', 'group_member.group_id', '=', 'group.id');

		const whereClause: Record<string, any> = {};

		whereClause['type_evaluation'] = props.typeEvaluation;
		whereClause['group_lecturer_member.lecturer_term_id'] = props.lecturerTermId;
		whereClause['group_member.student_term_id'] = props.studentTermId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findByLecturer(props: { lecturerId: number; typeEvaluation?: TypeEvaluation }): Promise<Assign[]> {
		const query = this.initQuery();
		const dateNow = new Date();

		query.withGraphFetched(
			'[group_lecturer, group_lecturer.members,group_lecturer.members.lecturer_term, group_lecturer.members.lecturer_term.lecturer, group, group.members, group.members.student_term,group.members.student_term.student]'
		);
		query.join('group_lecturer', 'group_lecturer.id', '=', 'assign.group_lecturer_id');
		query.join('group_lecturer_member', 'group_lecturer_member.group_lecturer_id', '=', 'group_lecturer.id');
		query.join('lecturer_term', 'group_lecturer_member.lecturer_term_id', '=', 'lecturer_term.id');
		query
			.join('term', 'lecturer_term.term_id', '=', 'term.id')
			.where('start_date', '<=', dateNow)
			.andWhere('end_date', '>=', dateNow)
			.andWhere('lecturer_term.lecturer_id', '=', props.lecturerId);

		if (props.typeEvaluation) {
			query.andWhere('type_evaluation', '=', props.typeEvaluation);
		}
		const result = await query.execute();
		return result && result.map(e => this.convertModelToEntity(e));
	}

	async findAll(props: { termId?: number; groupLecturerId?: number; type?: TypeEvaluation; groupId?: number }): Promise<Assign[]> {
		const query = this.initQuery();
		query.withGraphFetched(
			'[group_lecturer, group_lecturer.members,group_lecturer.members.lecturer_term, group_lecturer.members.lecturer_term.lecturer, group, group.members]'
		);

		const whereClause: Record<string, any> = {};

		if (props.termId) {
			query.join('group_lecturer', 'group_lecturer.id', '=', 'assign.group_lecturer_id').where({ 'group_lecturer.term_id': props.termId });
		}
		if (props.groupLecturerId) whereClause['group_lecturer_id'] = props.groupLecturerId;
		if (props.type) whereClause['type_evaluation'] = props.type;
		if (props.groupId) whereClause['group_id'] = props.groupId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
