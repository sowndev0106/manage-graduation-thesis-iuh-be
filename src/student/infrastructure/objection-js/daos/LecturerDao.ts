import { injectable } from 'inversify';
import Lecturer, { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import LecturerDaoCore from '@core/infrastructure/objection-js/daos/LecturerDao';
import ILecturerDao from '@student/domain/daos/ILecturerDao';

@injectable()
export default class LecturerDao extends LecturerDaoCore implements ILecturerDao {
	async findOneByRole(majorsId: number, role: TypeRoleLecturer): Promise<Lecturer | null> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['lecturer.majors_id'] = majorsId;
		whereClause['lecturer.role'] = role;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(majorsId?: number, termId?: number, role?: TypeRoleLecturer): Promise<Lecturer[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		if (majorsId) whereClause['lecturer.majors_id'] = majorsId;
		if (role) whereClause['lecturer.role'] = role;

		if (termId) {
			query.join('lecturer_term', 'lecturer_term.lecturer_id', '=', 'lecturer.id');
			query.where('lecturer_term.term_id', '=', termId);
		}
		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
	async findByUsername(username: string): Promise<Lecturer | null> {
		const query = this.initQuery();
		query.where('username', username);

		const result = await query.execute();
		return result && result[0] ? this.convertModelToEntity(result[0]) : null;
	}
}
