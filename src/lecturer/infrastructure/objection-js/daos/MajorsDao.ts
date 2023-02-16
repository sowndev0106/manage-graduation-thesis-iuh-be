import Majors from '@core/domain/entities/Majors';
import MajorsDaoCore from '@core/infrastructure/objection-js/daos/MajorsDao';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import { injectable } from 'inversify';

@injectable()
export default class MajorsDao extends MajorsDaoCore implements IMajorsDao {
	async findByName(name: string): Promise<Majors | null> {
		const query = this.initQuery();

		const result = await query.findOne({ name });
		return result ? this.convertModelToEntity(result) : null;
	}
}
