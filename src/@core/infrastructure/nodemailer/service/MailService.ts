import Nodemailer from '..';
import sendMailForgotPasswordHandler, { ISendMailForgotPassword } from './sendMailForgotPasswordHandler';

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
}

export default new MailService();
