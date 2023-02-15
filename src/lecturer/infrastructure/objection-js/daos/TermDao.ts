import Term from '@core/domain/entities/Term';
import TermDaoCore from '@core/infrastructure/objection-js/daos/TermDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import TermModel from '@core/infrastructure/objection-js/models/TermModel';
import { injectable } from 'inversify';

@injectable()
export default class TermDao extends TermDaoCore implements ITermDao {
	async findByNameAndMajors(name: string, majorsId: number): Promise<Term | null> {
		const query = this.initQuery();
		const result = await query.findOne({ name, majors_id: majorsId });

		return result ? this.convertModelToEntity(result) : null;
	}
}
