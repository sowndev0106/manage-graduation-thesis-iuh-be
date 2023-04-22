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
		header {
			display: flex;
		}
	</style>
	<body>
		<header>
			<div>
				<h1>TRƯỜNG ĐH CÔNG NGHIỆP TP. HCM</h1>
				<h1>KHOA CÔNG NGHỆ THÔNG TIN</h1>
				<h1>=======//======</h1>
			</div>
			<div>
				<h1>PHIẾU CHẤM ĐIỂM KHÓA LUẬN TỐT NGHIỆP</h1>
			</div>
		</header>
	</body>
</html>
`;
