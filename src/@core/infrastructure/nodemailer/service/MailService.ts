import Nodemailer from '..';
import sendMailForgotPasswordHandler, { ISendMailForgotPassword } from './sendMailForgotPasswordHandler';
import sendMailNotificationHandler from './sendMailNotificationHandler';

class MailService {
	private nodeMailer: Nodemailer;
	constructor() {
		this.nodeMailer = new Nodemailer();
	}
	async sendEmailForgotPassword(props: Omit<ISendMailForgotPassword, 'nodeMailer'>) {
		return sendMailForgotPasswordHandler({
			...props,
			nodeMailer: this.nodeMailer,
		});
	}
	async sendEmailNotification(email: string, message: string, url?: string) {
		if (!email) return;
		return sendMailNotificationHandler({
			to: email,
			message,
			nodeMailer: this.nodeMailer,
			url,
		});
	}
}

export default new MailService();
