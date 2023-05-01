import LecturerTerm from '@core/domain/entities/LecturerTerm';
import LecturerTermDaoCore from '@core/infrastructure/objection-js/daos/LecturerTermDao';
import ILecturerTermDao from '@student/domain/daos/ILecturerTermDao';
import { injectable } from 'inversify';

@injectable()
export default class LecturerTermDao extends LecturerTermDaoCore implements ILecturerTermDao {
	async findOneGraphById(id: number): Promise<LecturerTerm | null> {
		const query = this.initQuery();
		query.withGraphFetched('[lecturer]');

		const result = await query.findOne({ id });

		return result ? this.convertModelToEntity(result) : null;
	}
	async findOne(termId: number, lecturerId: number): Promise<LecturerTerm | null> {
		const query = this.initQuery();
		query.withGraphFetched('[lecturer]');
		const whereClause: Record<string, number> = {};
		whereClause.term_id = termId;
		whereClause.lecturer_id = lecturerId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
}
