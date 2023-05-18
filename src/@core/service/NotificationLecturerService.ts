import Lecturer from '@core/domain/entities/Lecturer';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import NotificationLecturer, { TypeNotificationLecturer } from '@core/domain/entities/NotificationLecturer';
import MailService from '@core/infrastructure/nodemailer/service/MailService';
import LecturerDao from '@lecturer/infrastructure/objection-js/daos/LecturerDao';
import LecturerTermDao from '@lecturer/infrastructure/objection-js/daos/LecturerTermDao';
import NotificationLecturerDao from '@lecturer/infrastructure/objection-js/daos/NotificationLecturerDao';
const baseUrl = process.env.URL_WEB!;
export default class NotificationLecturerService {
	static notificationDao = new NotificationLecturerDao();
	static lecturerDao = new LecturerDao();
	static lecturerTermDao = new LecturerTermDao();

	static async send(props: { user: Lecturer | LecturerTerm; message: string; type: TypeNotificationLecturer }) {
		const { user, message, type } = props;
		try {
			let lecturer: Lecturer;

			if (user instanceof Lecturer) {
				lecturer = user;
			} else {
				//  lecturer Term
				const { lecturerId, id } = user;
				if (!lecturerId) {
					const lecturerTerm = await this.lecturerTermDao.findEntityById(id);
					lecturer = (await this.lecturerDao.findEntityById(lecturerTerm?.lecturerId))!;
				} else {
					lecturer = user.lecturer;
				}
			}
			console.log(lecturer);
			await this.notificationDao.insertEntity(NotificationLecturer.create({ lecturer, message, type, read: false }));

			// send email
			let email = lecturer?.email;
			if (!email) {
				const lecturerReload = await this.lecturerDao.findEntityById(lecturer.id!);
				email = lecturerReload?.email;
			}
			await MailService.sendEmailNotification(email!, message, baseUrl);
		} catch (error) {
			console.log(error);
		}
	}
}
