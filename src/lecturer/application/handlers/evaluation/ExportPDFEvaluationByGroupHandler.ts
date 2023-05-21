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
import ILecturerTermDao from "@lecturer/domain/daos/ILecturerTermDao";
import ILecturerDao from "@lecturer/domain/daos/ILecturerDao";
import Lecturer from "@core/domain/entities/Lecturer";
import IGroupMemberDao from "@lecturer/domain/daos/IGroupMemberDao";
import IGroupDao from "@lecturer/domain/daos/IGroupDao";
import ITopicDao from "@lecturer/domain/daos/ITopicDao";
interface ValidatedInput {
  assign: Assign;
  lecturer: Lecturer;
}

@injectable()
export default class ExportPDFEvaluationByGroupHandler extends RequestHandler {
  @inject("TermDao") private termDao!: ITermDao;
  @inject("TopicDao") private topicDao!: ITopicDao;
  @inject("GroupMemberDao") private groupMemberDao!: IGroupMemberDao;
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("AssignDao") private assignDao!: IAssignDao;
  @inject("EvaluationDao") private evaluationDao!: IEvaluationDao;
  @inject("LecturerTermDao") private lecturerTermDao!: ILecturerTermDao;
  @inject("LecturerDao") private lecturerDao!: ILecturerDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const assignId = this.errorCollector.collect("assignId", () =>
      EntityId.validate({ value: request.params["assignId"] })
    );
    const lecturerId = Number(request.headers["id"]);
    const lecturer = await this.lecturerDao.findEntityById(lecturerId);
    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }
    let assign = await this.assignDao.findEntityById(assignId);
    if (!assign) throw new NotFoundError("assign not found");
    return { assign, lecturer: lecturer! };
  }

  async handle(request: Request) {
    const input = await this.validate(request);
    const group = await this.groupDao.findEntityById(input.assign.groupId);
    const topic = await this.topicDao.findEntityById(group?.topicId);
    const members = await this.groupMemberDao.findByGroupId({
      groupId: input.assign.groupId!,
    });

    const evaluations = await this.evaluationDao.findAll(
      group?.termId,
      input.assign.typeEvaluation
    );
    group?.update({ members });
    if (topic) group?.update({ topic });
    const doc = PDFKitService.generateEvalutionPDFDetail(
      evaluations,
      group!,
      input.lecturer
    );

    return doc;
  }
}
