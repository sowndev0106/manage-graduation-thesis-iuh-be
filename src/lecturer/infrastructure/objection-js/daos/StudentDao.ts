import Student from '@core/domain/entities/Student';
import StudentDaoCore from '@core/infrastructure/objection-js/daos/StudentDao';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import { injectable } from 'inversify';

@injectable()
export default class StudentDao extends StudentDaoCore implements IStudentDao {
	async findAll(majorsId?: number): Promise<Student[]> {
		const query = this.initQuery();
		if (majorsId) {
			query.where('majors_id', majorsId);
		}
		query.orderBy('updated_at', 'desc');
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}

	async findByUsername(username: string): Promise<Student | null> {
		const query = this.initQuery();

		query.where('username', username);

		const result = await query.execute();
		return result && result[0] ? this.convertModelToEntity(result[0]) : null;
	}
}
