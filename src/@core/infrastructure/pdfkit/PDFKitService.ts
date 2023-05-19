import Evaluation, { TypeEvaluation } from "@core/domain/entities/Evaluation";
import PDFDocument from "pdfkit";
import fs from "fs";
import GenerateEvalutionPDF from "./GenerateEvalutionPDF";
import Assign from "@core/domain/entities/Assign";
import GenerateEvalutionPDFByAssign from "./GenerateEvalutionPDFByAssign";
export default class PDFKitService {
  static generateEvalutionPDF(evaluations: Array<Evaluation>) {
    const generateEvalutionPDF = new GenerateEvalutionPDF(evaluations);
    return generateEvalutionPDF.excute();
  }
  static generateEvalutionPDFByAssign(assign: Assign) {
    const generateEvalutionPDF = new GenerateEvalutionPDFByAssign(assign);
    return generateEvalutionPDF.excute();
  }
  static convertHTMLToPDFBuffer() {}
}
