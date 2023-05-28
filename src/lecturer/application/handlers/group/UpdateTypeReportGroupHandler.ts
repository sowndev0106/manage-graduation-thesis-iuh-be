import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import EntityId from "@core/domain/validate-objects/EntityID";
import ITermDao from "@lecturer/domain/daos/ITermDao";
import IGroupDao from "@lecturer/domain/daos/IGroupDao";
import IGroupMemberDao from "@lecturer/domain/daos/IGroupMemberDao";
import NotFoundError from "@core/domain/errors/NotFoundError";
import TypeEvaluationValidate from "@core/domain/validate-objects/TypeEvaluationValidate";
import TypeReportGroupValidate from "@core/domain/validate-objects/TypeReportGroupValidate";
import Group, { TypeReportGroup } from "@core/domain/entities/Group";
import NotificationStudentService from "@core/service/NotificationStudentService";

interface ValidatedInput {
  group: Group;
  typeReport: TypeReportGroup;
}

@injectable()
export default class UpdateTypeReportGroupHandler extends RequestHandler {
  @inject("TermDao") private termDao!: ITermDao;
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("GroupMemberDao") private groupMemberDao!: IGroupMemberDao;

  async validate(request: Request): Promise<ValidatedInput> {
    const groupId = this.errorCollector.collect("id", () =>
      EntityId.validate({ value: String(request.params["id"]) })
    );

    const typeReport = this.errorCollector.collect("typeReport", () =>
      TypeReportGroupValidate.validate({ value: request.body["typeReport"] })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }
    const group = await this.groupDao.findEntityById(groupId);
    if (!group) {
      throw new NotFoundError("group not found");
    }
    return { group, typeReport };
  }

  async handle(request: Request) {
    const { group, typeReport } = await this.validate(request);
    if (typeReport != group.typeReport) {
      group.update({ typeReport });
      await this.groupDao.updateEntity(group);
      await this.notification(group);
    }
    return group.toJSON;
  }
  async notification(group: Group) {
    const members = await this.groupMemberDao.findByGroupId({
      groupId: group.id!,
    });
    for (const member of members) {
      await NotificationStudentService.send({
        user: member.studentTerm!,
        message: `Nhóm của bạn được phân loại báo cáo là: ${
          group.typeReport == TypeReportGroup.OPEN
            ? "Chưa xác định"
            : group.typeReport == TypeReportGroup.POSTER
            ? "POSTER"
            : "HỘI ĐỒNG"
        }`,
        type: "CHOOSE_TOPIC",
      });
    }
  }
}
