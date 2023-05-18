import NotificationLecturer from '@core/domain/entities/NotificationLecturer';
import NotificationLecturerDaoCore from '@core/infrastructure/objection-js/daos/NotificationLecturerDao';
import INotificationLecturerDao from '@lecturer/domain/daos/INotificationLecturerDao';
import { injectable } from 'inversify';

@injectable()
export default class NotificationLecturerDao extends NotificationLecturerDaoCore implements INotificationLecturerDao {
	async readAll(props: { lecturerId: number }): Promise<boolean> {
		const query = this.initQuery();

		query.update({ read: true }).where({ lecturer_id: props.lecturerId });

		const result = await query.execute();
		return !!result;
	}
	async findAll(props: { lecturerId: number }): Promise<NotificationLecturer[]> {
		const query = this.initQuery();
		query.withGraphFetched('[lecturer]');
		const whereClause: Record<string, any> = {};

		whereClause['lecturer_id'] = props.lecturerId;

		query.where(whereClause).orderBy('created_at', 'desc');

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
