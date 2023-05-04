import Term from '@core/domain/entities/Term';
import TermDaoCore from '@core/infrastructure/objection-js/daos/TermDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import { injectable } from 'inversify';
import Objection from 'objection';
@injectable()
export default class TermDao extends TermDaoCore implements ITermDao {
	async findNowByMajorsId(majorsId: number): Promise<Term | null> {
		const query = this.initQuery();
		const dateNow = new Date();

		query.where('start_date', '<=', dateNow).andWhere('end_date', '>=', dateNow).andWhere('majors_id', '=', majorsId);

		query.limit(1);

		const result = await query.execute();

		return result[0] ? this.convertModelToEntity(result[0]) : null;
	}
	async findLatestByMajorsId(majorsId: number): Promise<Term | null> {
		const query = this.initQuery();
		query.orderBy('end_date', 'desc');

		const result = await query.findOne({ majors_id: majorsId });

		return result ? this.convertModelToEntity(result) : null;
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
