import Student from '@core/domain/entities/Student';
import StudentDaoCore from '@core/infrastructure/objection-js/daos/StudentDao';
import StudentModel from '@core/infrastructure/objection-js/models/StudentModel';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import { injectable } from 'inversify';
import { transaction } from 'objection';

@injectable()
export default class StudentDao extends StudentDaoCore implements IStudentDao {
	async findAll(majorsId?: number): Promise<Student[]> {
		const query = this.initQuery();
		query.withGraphFetched('user');
		if (majorsId) {
			query.join('user', 'student.user_id', '=', 'user.id');
			query.where('user.majors_id', majorsId);
		}
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}

	async findByUsername(username: string): Promise<Student | null> {
		const query = this.initQuery();

		query.withGraphFetched('user');
		query.join('user', 'student.user_id', '=', 'user.id');
		query.where('user.username', username);

		const result = await query.execute();
		return result && result[0] ? this.convertModelToEntity(result[0]) : null;
	}
}
