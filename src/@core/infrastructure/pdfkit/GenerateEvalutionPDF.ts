import Evaluation from '@core/domain/entities/Evaluation';
import puppeteer from 'puppeteer';
import hb from 'handlebars';

// Example of options with args //

export default class GenerateEvalutionPDF {
	private evaluations: Array<Evaluation>;
	constructor(evaluations: Array<Evaluation>) {
		this.evaluations = evaluations;
	}
	async excute() {
		// this.generateHeader();
		// this.generateInvoiceTable();
		// this.generateFooter();
		return this.printPDF();
	}

	async printPDF() {
		const browser = await puppeteer.launch({
			headless: true,
			// executablePath: '/usr/bin/chromium-browser',
		});
		const page = await browser.newPage();
		// const data = await inlineCss(dataHDoc, { url: '/' });
		// we have compile our code with handlebars
		const template = hb.compile(dataHDoc, { strict: true });
		const result = template(dataHDoc);
		const html = result;

		await page.setContent(html, {
			waitUntil: 'networkidle0',
			timeout: 4000, // wait for page to load completely
		});

		const buffer = await page.pdf({
			format: 'A4',
		});

		await browser.close();

		return buffer;
	}
}

const dataHDoc = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Phiếu chấm</title>
	</head>
	<style>
		body {
			padding: 40px 20px;
			font-size: 12px;
		}
		header {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		ol {
			font-weight: 600;
		}
		li {
			margin-top: 10px;
		}
		.content-info {
			padding: 0 40px;
		}
		table,
		th,
		td {
			border: 1px solid rgb(0, 0, 0);
			border-collapse: collapse;
		}
		table {
			margin-top: 10px;
			width: 100%;
		}
		thead {
			text-align: center;
		}
		</style>
	<body>
		<header>
			<b>TRƯỜNG ĐH CÔNG NGHIỆP TP. HCM</b>
			<span>KHOA CÔNG NGHỆ THÔNG TIN</span>
			<span>=======//======</span>
			<br />
			<b>PHIẾU CHẤM ĐIỂM KHÓA LUẬN TỐT NGHIỆP</b>
		</header>
		<br />
		<div class="content-info">
			<ol>
				<li>Tên đề tài:</li>
				<li>
					Nhóm thực hiện:
					<table>
						<thead>
							<tr>
								<th>MSSV</th>
								<th>Họ tên</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td >&#x200B</td>
								<td style="width: 70%;"></td>
							</tr>
							<tr>
								<td>&#x200B</td>
								<td></td>
							</tr>
							<tr>
								<td>&#x200B</td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</li>
				<li>Họ tên người chấm điểm:</li>
				<li>Vai trò của người đánh giá:</li>
			</ol>
		</div>
	</body>
</html>
`;
