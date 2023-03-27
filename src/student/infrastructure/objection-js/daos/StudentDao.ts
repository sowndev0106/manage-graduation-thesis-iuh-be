import Student from '@core/domain/entities/Student';
import StudentDaoCore from '@core/infrastructure/objection-js/daos/StudentDao';
import StudentModel from '@core/infrastructure/objection-js/models/StudentModel';
import IStudentDao from '@student/domain/daos/IStudentDao';
import { injectable } from 'inversify';

@injectable()
export default class StudentDao extends StudentDaoCore implements IStudentDao {
	async findByUsername(username: string): Promise<Student | null> {
		const query = this.initQuery();
		query.where('username', username);

		const result = await query.execute();
		return result && result[0] ? this.convertModelToEntity(result[0]) : null;
	}
	async findAll(termId: number, groupExists?: boolean): Promise<Student[]> {
		const query = this.initQuery();

		query.join('student_term', 'student_term.student_id', 'student.id').where({ 'student_term.term_id': termId });
		query.leftJoin('group_member', 'group_member.student_id', 'student.id');
		query.leftJoin('group', 'group_member.group_id', 'group.id');

		if (groupExists != undefined) {
			if (groupExists) {
				// get student have group in term
				query.andWhere({ 'group.term_id': termId });
			} else {
				// get student don't have group  in term
				query.andWhereRaw('(`group`.`term_id` != ' + termId + ' or  `group`.`term_id` is null)');
			}
		}
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
