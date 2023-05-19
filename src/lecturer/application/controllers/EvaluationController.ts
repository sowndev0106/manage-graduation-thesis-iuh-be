import { NextFunction, Request, Response } from "express";
import Ioc from "@lecturer/infrastructure/inversify";
import CreateEvaluationHandler from "../handlers/evaluation/CreateEvaluationHandler";
import UpdateEvaluationHandler from "../handlers/evaluation/UpdateEvaluationHandler";
import GetListEvaluationHandler from "../handlers/evaluation/GetListEvaluationHandler";
import GetEvaluationByIdHandler from "../handlers/evaluation/GetEvaluationByIdHandler";
import DeleteEvaluationHandler from "../handlers/evaluation/DeleteEvaluationHandler";
import GenerateEvaluationHandler from "../handlers/evaluation/GenerateEvaluationHandler";
import { Readable } from "stream";

import fs from "fs-extra";
import ExportPDFEvaluationByGroupHandler from "../handlers/evaluation/ExportPDFEvaluationByGroupHandler";

class EvaluationController {
  async createEvaluation(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(CreateEvaluationHandler).handle(req);
    return res.status(200).json(data);
  }
  async updateEvaluation(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(UpdateEvaluationHandler).handle(req);
    return res.status(200).json(data);
  }
  async getListEvaluation(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GetListEvaluationHandler).handle(req);
    return res.status(200).json(data);
  }
  async getEvaluationById(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GetEvaluationByIdHandler).handle(req);
    return res.status(200).json(data);
  }
  async deleteEvaluation(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(DeleteEvaluationHandler).handle(req);
    return res.status(200).json(data);
  }
  async generateEvaluation(req: Request, res: Response, next: NextFunction) {
    const doc = await Ioc.get(GenerateEvaluationHandler).handle(req);
    res.setHeader("Content-Type", "application/pdf");
    res.end(doc);
  }
  async exportPDFEvaluationByGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const doc = await Ioc.get(ExportPDFEvaluationByGroupHandler).handle(req);
    res.setHeader("Content-Type", "application/pdf");
    res.end(doc);
  }
}

export default new EvaluationController();
