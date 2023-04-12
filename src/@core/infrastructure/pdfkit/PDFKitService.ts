import Evaluation from '@core/domain/entities/Evaluation';
import PDFDocument from 'pdfkit';
import fs from 'fs';
export default class PDFKitService {
	static generateEvalutionPDF(evaluations: Array<Evaluation>) {
		const doc = new PDFDocument();
		doc.fontSize(25).text('Some text with an embedded font!', 100, 100);
		doc.end();
		return doc;
	}
}
