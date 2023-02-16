import Term from '@core/domain/entities/Term';
import TermDaoCore from '@core/infrastructure/objection-js/daos/TermDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import { injectable } from 'inversify';
import Objection from 'objection';
@injectable()
export default class TermDao extends TermDaoCore implements ITermDao {
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
