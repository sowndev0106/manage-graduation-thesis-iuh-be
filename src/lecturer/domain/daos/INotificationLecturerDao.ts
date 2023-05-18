import IDao from '@core/domain/daos/IDao';
import NotificationLecturer from '@core/domain/entities/NotificationLecturer';

export default interface INotificationLecturerDao extends IDao<NotificationLecturer> {
	findAll(props: { lecturerId: number }): Promise<NotificationLecturer[]>;
	readAll(props: { lecturerId: number }): Promise<boolean>;
}
