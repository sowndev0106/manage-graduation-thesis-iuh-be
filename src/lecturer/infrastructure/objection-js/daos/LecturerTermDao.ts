import LecturerTerm from '@core/domain/entities/LecturerTerm';
import LecturerTermDaoCore from '@core/infrastructure/objection-js/daos/LecturerTermDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import { injectable } from 'inversify';

@injectable()
export default class LecturerTermDao extends LecturerTermDaoCore implements ILecturerTermDao {
	async findOne(termId: number, lecturerId: number): Promise<LecturerTerm | null> {
		const query = this.initQuery();

		const whereClause: Record<string, number> = {};
		whereClause.term_id = termId;
		whereClause.lecturer_id = lecturerId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
}
