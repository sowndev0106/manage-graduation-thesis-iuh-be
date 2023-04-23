import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import GenerateEvalutionPDF from './GenerateEvalutionPDF';
export default class PDFKitService {
	static generateEvalutionPDF(evaluations: Array<Evaluation>) {
		const generateEvalutionPDF = new GenerateEvalutionPDF(evaluations);
		return generateEvalutionPDF.excute();
	}
	static convertHTMLToPDFBuffer() {}
}
