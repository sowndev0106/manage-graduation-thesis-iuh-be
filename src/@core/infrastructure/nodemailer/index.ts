import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Lodash from 'lodash';

import { injectable } from 'inversify';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@injectable()
export default class Nodemailer {
	private _transporter: Mail;

	constructor() {
		const transportOptions: SMTPTransport.Options = {
			host: process.env.NODEMAILER_TRANSPORT_HOST,
			port: +process.env.NODEMAILER_TRANSPORT_PORT!,
			secure: process.env.NODEMAILER_TRANSPORT_SECURE === 'true',
			tls: {
				rejectUnauthorized: process.env.NODE_ENV === 'production',
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

	async sendTextMail({ from, to, subject, text, cc, bcc, headers }: any) {
		try {
			return await this._transporter.sendMail({
				from,
				to,
				cc,
				bcc,
				subject,
				headers: Lodash.merge(headers, { 'x-from': 'subscription-manager' }),
				text,
			});
		} catch (e:any) {
			throw new Error(`Send mail error: ${e.message}`);
		}
	}

	async sendHtmlMail({ from, to, cc, bcc, subject, html, headers }: any) {
		try {
			return await this._transporter.sendMail({
				from,
				to,
				cc,
				bcc,
				subject,
				headers: Lodash.merge(headers, { 'x-from': 'subscription-manager' }),
				html,
			});
		} catch (e:any) {
			throw new Error(`Send mail error: ${e.message}`);
		}
	}
}
