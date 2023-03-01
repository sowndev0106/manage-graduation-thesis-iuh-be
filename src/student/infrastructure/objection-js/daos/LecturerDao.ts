import { injectable } from 'inversify';
import Lecturer from '@core/domain/entities/Lecturer';
import LecturerDaoCore from '@core/infrastructure/objection-js/daos/LecturerDao';
import ILecturerDao from '@student/domain/daos/ILecturerDao';

@injectable()
export default class LecturerDao extends LecturerDaoCore implements ILecturerDao {
	async findAll(majorsId?: number | undefined, isHeadLecturer?: Boolean): Promise<Lecturer[]> {
		const query = this.initQuery();
		query.withGraphFetched('user');
		if (isHeadLecturer != undefined) {
			if (isHeadLecturer == true) query.join('majors', 'majors.head_lecturer_id', '=', 'lecturer.id');
			if (isHeadLecturer == false) {
				query.leftJoin('majors', 'majors.head_lecturer_id', '=', 'lecturer.id');
				query.whereNull('head_lecturer_id');
			}
		}
		if (majorsId) {
			query.join('user', 'lecturer.user_id', '=', 'user.id');
			query.where('user.majors_id', majorsId);
		}
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
