import IDao from '@core/domain/daos/IDao';
import NotificationStudent from '@core/domain/entities/NotificationStudent';

export default interface INotificationStudentDao extends IDao<NotificationStudent> {
	findAll(props: { studentId: number }): Promise<NotificationStudent[]>;
	readAll(props: { studentId: number }): Promise<boolean>;
}
