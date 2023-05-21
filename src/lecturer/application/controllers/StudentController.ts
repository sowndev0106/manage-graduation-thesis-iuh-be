import { NextFunction, Request, Response } from "express";
import Ioc from "@lecturer/infrastructure/inversify";
import GetMyInfoHandlers from "../handlers/me/GetMyInfoHandler";
import ImportStudentByExcelHandler from "../handlers/student/ImportStudentByExcelHandler";
import ImportLecturerByExcelHandler from "../handlers/lecturer/ImportLecturerByExcelHandler";
import GetListStudent from "../handlers/student/GetListStudent";
import GetStudentById from "../handlers/student/GetStudentById";
import AddStudentHandlers from "../handlers/student/AddStudentHandlers";
import ResetPassword from "../handlers/student/ResetPassword";
import ExportTranscriptHandler from "../handlers/student/ExportTranscriptHandler";
import XLSX from "xlsx";
import fs from "fs";
class UserController {
  async importStudentByExcel(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(ImportStudentByExcelHandler).handle(req);
    return res.status(200).json(data);
  }
  async addStudent(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(AddStudentHandlers).handle(req);
    return res.status(200).json(data);
  }
  async getStudents(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GetListStudent).handle(req);
    return res.status(200).json(data);
  }
  async exportTranscript(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(ExportTranscriptHandler).handle(req);
    res.setHeader("Content-Type", "application/csv");
    XLSX.stream.to_csv(data).pipe(res);
  }
  async getStudentById(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GetStudentById).handle(req);
    return res.status(200).json(data);
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(ResetPassword).handle(req);
    return res.status(200).json(data);
  }
}

export default new UserController();
