import Nodemailer from '..';

export interface ISendMailForgotPassword {
	token: string;
	type: 'student' | 'lecturer';
	nodeMailer: Nodemailer;
	to: string;
}
export default async function sendMailForgotPasswordHandler(props: ISendMailForgotPassword) {
	const from = 'graduation-thesis-iuh';
	const subject = 'Graduation Thesis IUH: Đặt lại mật khẩu';
	const html = genderTemplateEmail(props.token, props.type);
	await props.nodeMailer.sendHtmlMail({
		from,
		to: props.to,
		subject,
		html,
	});
}
function genderTemplateEmail(token: string, type: 'student' | 'lecturer'): string {
	const host = process.env.BASE_URL;
	const url = `${host}/user/reset-password?token=${token}&type=${type}`;
	const template = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initia l-scale=1.0" />
        </head>
        <body>
            <h1>Đặt lại mật khẩu</h1>
            <span> Truy cập vào đường dẫn <a href="${url}">Link đặt lại mật khẩu</a> </span>
        </body>
    </html>
`;
	return template;
}
