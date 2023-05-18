import Nodemailer from '..';

export interface ISendMailNotificationHandler {
	message: string;
	url?: string;
	nodeMailer: Nodemailer;
	to: string;
}
export default async function sendMailNotificationHandler(props: ISendMailNotificationHandler) {
	const { message, url, nodeMailer, to } = props;
	const from = 'graduation-thesis-iuh';
	const subject = 'Graduation Thesis IUH: Thông báo';
	const html = genderTemplateEmail(message, url);
	await nodeMailer.sendHtmlMail({
		from,
		to: to,
		subject,
		html,
	});
}
function genderTemplateEmail(message: string, url?: string): string {
	const template = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initia l-scale=1.0" />
        </head>
        <body>
            <h1>${message}</h1>
            ${url ? `<span><a href="${url}"> Xem chi tiết</a> </span>` : `<span>Hãy mở ứng dụng để kiểm tra</span>`}
        </body>
    </html>
`;
	return template;
}
