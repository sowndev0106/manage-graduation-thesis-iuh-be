import { injectable } from 'inversify';
import Lecturer, { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import LecturerDaoCore from '@core/infrastructure/objection-js/daos/LecturerDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';

@injectable()
export default class LecturerDao extends LecturerDaoCore implements ILecturerDao {
	async findAll(majorsId?: number | undefined, isHeadLecturer?: Boolean): Promise<Lecturer[]> {
		const query = this.initQuery();
		if (isHeadLecturer != undefined) {
			if (isHeadLecturer == true) query.where('role', '=', TypeRoleLecturer.HEAD_LECTURER);
			if (isHeadLecturer == false) query.where('role', '!=', TypeRoleLecturer.HEAD_LECTURER);
		}
		if (majorsId) {
			query.where('majors_id', majorsId);
		}
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
