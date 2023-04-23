import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
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
			args: ['--no-sandbox'],
			// executablePath: '/usr/bin/chromium-browser',
		});
		const page = await browser.newPage();
		// const data = await inlineCss(dataHDoc, { url: '/' });
		// we have compile our code with handlebars
		const templateHTML = generateHTMLEvaluation(this.evaluations, this.evaluations[0]?.type);
		const template = hb.compile(templateHTML, { strict: true });
		const result = template(templateHTML);
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
const generateHTMLEvaluation = (evaluations: Array<Evaluation>, typeEvalution?: TypeEvaluation) => {
	const typeEvalutionHTML = typeEvalution
		? typeEvalution == TypeEvaluation.ADVISOR
			? 'GV Hướng dẫn'
			: typeEvalution == TypeEvaluation.REVIEWER
			? 'Phản biện'
			: 'Hội đồng'
		: '';
	const evaluationsHTML = evaluations
		.map((e, index) => {
			return `	<tr>
					<td>${index + 1}</td>
					<td class="text-left">${e.name}</td>
					<td>${e.gradeMax}</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>`;
		})
		.join('');
	return `
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
		padding: 40px 40px;
		font-size: 12px;
		font-family: 'Times New Roman', Times, serif;
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
		overflow-wrap: break-word;
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
		text-align: center;
	}

	thead {
		text-align: center;

	}

	.content-evaluation {
		text-align: center;
	}

	.content-evaluation td {
		padding: 15px 5px;
	}

	.content-footer {
		padding: 20px 70px;
		overflow-wrap: break-word;
	}

	.content-footer .date {
		display: flex;
		flex-direction: row-reverse;
		margin-top: 30px;
	}
	.date .content-date{
		text-align: center;
	}

	.text-left {
		text-align: left;
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
							<th>TT</th>
							<th>MSSV</th>
							<th>Họ tên</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="width: 5%;">1</td>
							<td style="width: 15%;">&#x200B</td>
							<td style="width: 80%;"></td>

						</tr>
						<tr>
							<td>3</td>
							<td>&#x200B</td>
							<td></td>
						</tr>
						<tr>
							<td>2</td>
							<td>&#x200B</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</li>
			<li>Họ tên người chấm điểm:</li>
			<li>Vai trò của người đánh giá: <span style="font-weight: 400;"> ${typeEvalutionHTML} </span></li>
		</ol>
	</div>
	<div class="content-evaluation">
			<br />
		<h2>Nội dung đánh giá</h2>
		<table>
			<thead>
				<tr>
					<th style="width: 5%;">TT</th>
					<th style="width: 40%;">Nội dung</th>
					<th>Điểm tối đa</th>
					<th>Điểm SV 1</th>
					<th>Điểm SV 2 </th>
					<th>Điểm SV 3 </th>
					<th style="width: 25%;">CÁC Ý KIẾN NHẬN XÉT</th>
				</tr>
			</thead>
			<tbody>
				${evaluationsHTML}
				<tr>
					<td>&#x200B</td>
					<td>Cộng</td>
					<td>10</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<br>
	<div class="content-footer">
		<b style=>Các góp ý cho khóa luận:</b>
		<span>………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………</span>
		<div class="date">
			<div class="content-date">
				<span> TP. Hồ Chí Minh, ngày tháng năm </span>
				<br>
				<b> Người chấm điểm</b>
			</div>
		</div>
	</div>
</body>

</html>
`;
};
