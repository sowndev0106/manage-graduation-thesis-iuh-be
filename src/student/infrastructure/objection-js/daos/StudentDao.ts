import Student from '@core/domain/entities/Student';
import StudentDaoCore from '@core/infrastructure/objection-js/daos/StudentDao';
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
}
