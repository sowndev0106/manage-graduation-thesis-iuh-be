import Student from '@core/domain/entities/Student';
import StudentTerm from '@core/domain/entities/StudentTerm';
import NotificationStudent, { TypeNotificationStudent } from '@core/domain/entities/NotificationStudent';
import MailService from '@core/infrastructure/nodemailer/service/MailService';
import StudentDao from '@student/infrastructure/objection-js/daos/StudentDao';
import StudentTermDao from '@student/infrastructure/objection-js/daos/StudentTermDao';
import NotificationStudentDao from '@student/infrastructure/objection-js/daos/NotificationStudentDao';
const baseUrl = process.env.URL_WEB!;
export default class NotificationStudentService {
	static notificationDao = new NotificationStudentDao();
	static studentDao = new StudentDao();
	static studentTermDao = new StudentTermDao();

	static async send(props: { user: Student | StudentTerm; message: string; type: TypeNotificationStudent }) {
		const { user, message, type } = props;
		try {
			let student: Student;

			if (user instanceof Student) {
				student = user;
			} else {
				const { studentId, id } = user;
				if (!studentId) {
					const studentTerm = await this.studentTermDao.findEntityById(id);
					student = (await this.studentDao.findEntityById(studentTerm?.studentId))!;
				} else {
					student = user.student;
				}
			}

			await this.notificationDao.insertEntity(NotificationStudent.create({ student, message, type, read: false }));

			// send email
			let email = student?.email;
			if (!email) {
				const studentReload = await this.studentDao.findEntityById(student.id!);
				email = studentReload?.email;
			}
			await MailService.sendEmailNotification(email!, message);
		} catch (error) {
			console.log(error);
		}
	}
}
