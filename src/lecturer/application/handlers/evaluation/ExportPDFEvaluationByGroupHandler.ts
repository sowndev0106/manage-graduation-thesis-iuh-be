import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import EntityId from "@core/domain/validate-objects/EntityID";
import IEvaluationDao from "@lecturer/domain/daos/IEvaluationDao";
import ITermDao from "@lecturer/domain/daos/ITermDao";
import { TypeEvaluation } from "@core/domain/entities/Evaluation";
import TypeEvaluationValidate from "@core/domain/validate-objects/TypeEvaluationValidate";
import PDFKitService from "@core/infrastructure/pdfkit/PDFKitService";
import Assign from "@core/domain/entities/Assign";
import IAssignDao from "@lecturer/domain/daos/IAssignDao";
import NotFoundError from "@core/domain/errors/NotFoundError";
interface ValidatedInput {
  assign: Assign;
}

@injectable()
export default class ExportPDFEvaluationByGroupHandler extends RequestHandler {
  @inject("TermDao") private termDao!: ITermDao;
  @inject("AssignDao") private assignDao!: IAssignDao;
  @inject("EvaluationDao") private evaluationDao!: IEvaluationDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const assignId = this.errorCollector.collect("assignId", () =>
      EntityId.validate({ value: request.params["assignId"] })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }
    let assign = await this.assignDao.findEntityById(assignId);
    if (!assign) throw new NotFoundError("term not found");
    return { assign };
  }

  async handle(request: Request) {
    const input = await this.validate(request);

    const doc = PDFKitService.generateEvalutionPDFByAssign(input.assign);

    return doc;
  }
}
