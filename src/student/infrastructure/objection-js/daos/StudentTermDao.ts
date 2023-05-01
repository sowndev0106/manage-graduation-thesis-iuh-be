import StudentTerm from '@core/domain/entities/StudentTerm';
import StudentTermDaoCore from '@core/infrastructure/objection-js/daos/StudentTermDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import { injectable } from 'inversify';

@injectable()
export default class StudentTermDao extends StudentTermDaoCore implements IStudentTermDao {
	async findOneGraphById(id: number): Promise<StudentTerm | null> {
		const query = this.initQuery();
		query.withGraphFetched('[student]');

		const result = await query.findOne({ id });

		return result ? this.convertModelToEntity(result) : null;
	}
	async findOne(termId: number, studentId: number): Promise<StudentTerm | null> {
		const query = this.initQuery();
		query.withGraphFetched('[student]');
		const whereClause: Record<string, number> = {};
		whereClause.term_id = termId;
		whereClause.student_id = studentId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
}
