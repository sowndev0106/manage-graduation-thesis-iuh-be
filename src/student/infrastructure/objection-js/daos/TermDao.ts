import Term from '@core/domain/entities/Term';
import TermDaoCore from '@core/infrastructure/objection-js/daos/TermDao';
import ITermDao from '@student/domain/daos/ITermDao';
import { injectable } from 'inversify';

@injectable()
export default class TermDao extends TermDaoCore implements ITermDao {
	async findLastTermByMajors(majorsId: number): Promise<Term | null> {
		const query = this.initQuery();
		query.orderBy('created_at', 'DESC').limit(1);
		query.where({ majors_id: majorsId });
		const result = await query.execute();

		return result[0] ? this.convertModelToEntity(result[0]) : null;
	}
	async findByYearAndMajors(majorsId: number, fromYear?: number, toYear?: number): Promise<Term[]> {
		const query = this.initQuery();
		if (fromYear && toYear) {
			query
				.where('start_date', '>=', new Date(`01/01/${fromYear}`))
				.andWhere('end_date', '<=', new Date(`01/01/${toYear + 1}`))
				.andWhere('majors_id', '=', majorsId);
		} else if (majorsId) {
			query.where('majors_id', '=', majorsId);
		}
		const results = await query.execute();

		return results.map(e => this.convertModelToEntity(e));
	}
}
