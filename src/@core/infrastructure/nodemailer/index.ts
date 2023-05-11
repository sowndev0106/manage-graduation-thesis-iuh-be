import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Lodash from 'lodash';

import { injectable } from 'inversify';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class Nodemailer {
	private _transporter: Mail;

	constructor() {
		const transportOptions: SMTPTransport.Options = {
			host: process.env.NODEMAILER_TRANSPORT_HOST,
			port: +process.env.NODEMAILER_TRANSPORT_PORT!,
			secure: process.env.NODEMAILER_TRANSPORT_SECURE === 'true',
			tls: {
				rejectUnauthorized: process.env.NODEMAILER_TRANSPORT_TLS === 'true',
			},
			auth: {
				pass: process.env.SMTP_PASSWORD,
				user: process.env.SMTP_USERNAME,
			},
		};

		this._transporter = nodemailer.createTransport(transportOptions);
	}

	public get transporter() {
		return this._transporter;
	}

	public set transporter(transporter: Mail) {
		this._transporter = transporter;
	}

	async sendTextMail(props: { from: string; to: string; subject: string; text: string; cc?: string; bcc?: string; headers?: any }) {
		try {
			return await this._transporter.sendMail({
				from: props.from,
				to: props.to,
				cc: props.cc,
				bcc: props.bcc,
				subject: props.subject,
				headers: Lodash.merge(props.headers, { 'x-from': 'subscription-manager' }),
				text: props.text,
			});
		} catch (e: any) {
			throw new ErrorCode('SEND_MAIL_FAIL', `Send mail error: ${e.message}`);
		}
	}

	async sendHtmlMail(props: { from: string; to: string; cc?: string; bcc?: string; subject: string; html: string; headers?: any }) {
		try {
			return await this._transporter.sendMail({
				from: props.from,
				to: props.to,
				cc: props.cc,
				bcc: props.bcc,
				subject: props.subject,
				headers: Lodash.merge(props.headers, { 'x-from': 'subscription-manager' }),
				html: props.html,
			});
		} catch (e: any) {
			throw new ErrorCode('SEND_MAIL_FAIL', `Send mail error: ${e.message}`);
		}
	}
}
