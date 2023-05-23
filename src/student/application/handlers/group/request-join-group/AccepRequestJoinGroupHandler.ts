import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import EntityId from "@core/domain/validate-objects/EntityID";
import IRequestJoinGroupDao from "@student/domain/daos/IRequestJoinGroupDao";
import RequestJoinGroup, {
  TypeRequestJoinGroup,
} from "@core/domain/entities/RequestJoinGroup";
import IGroupMemberDao from "@student/domain/daos/IGroupMemberDao";
import NotFoundError from "@core/domain/errors/NotFoundError";
import GroupMember from "@core/domain/entities/GroupMember";
import Student from "@core/domain/entities/Student";
import IGroupDao from "@student/domain/daos/IGroupDao";
import StudentTerm from "@core/domain/entities/StudentTerm";
import IStudentTermDao from "@student/domain/daos/IStudentTermDao";
import Group from "@core/domain/entities/Group";
import NotificationStudentService from "@core/service/NotificationStudentService";
import IStudentDao from "@student/domain/daos/IStudentDao";
import { group } from "console";
import ErrorCode from "@core/domain/errors/ErrorCode";
import ITermDao from "@lecturer/domain/daos/ITermDao";
import checkDateTerm from "@core/utils/checkDateTerm";

interface ValidatedInput {
  studentTerm: StudentTerm;
  requestJoinGroup: RequestJoinGroup;
  group: Group;
}

@injectable()
export default class accepRequestJoinGroupHandler extends RequestHandler {
  @inject("RequestJoinGroupDao")
  private requestJoinGroupDao!: IRequestJoinGroupDao;
  @inject("GroupMemberDao") private groupMemberDao!: IGroupMemberDao;
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("StudentTermDao") private studentTermDao!: IStudentTermDao;
  @inject("StudentDao") private studentDao!: IStudentDao;
  @inject("TermDao") private termDao!: ITermDao;

  async validate(request: Request): Promise<ValidatedInput> {
    const id = this.errorCollector.collect("id", () =>
      EntityId.validate({ value: request.params["id"] })
    );
    const studentId = Number(request.headers["id"]);

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }
    let requestJoinGroup = await this.requestJoinGroupDao.findEntityById(id);
    if (!requestJoinGroup) throw new NotFoundError("request not found");

    const group = await this.groupDao.findEntityById(requestJoinGroup.groupId);
    if (!group) {
      throw new NotFoundError("Group have been deleted");
    }

    const term = await this.termDao.findEntityById(group.termId!);

    // check validate time
    checkDateTerm(term!, "UPDATE_GROUP");

    const studentTerm = await this.studentTermDao.findOne(
      group.termId!,
      studentId
    );
    if (!studentTerm) {
      throw new ErrorCode(
        "STUDENT_NOT_IN_TERM",
        `student not in term ${group.termId}`
      );
    }
    return { requestJoinGroup, studentTerm, group };
  }
  async handle(request: Request) {
    const input = await this.validate(request);
    if (input.requestJoinGroup.type === TypeRequestJoinGroup.REQUEST_INVITE) {
      await this.checkAccepInviteHandler(input);
    } else {
      await this.checkAccepRequestJoinHandler(input);
    }

    await this.requestJoinGroupDao.deleteByStudentTerm({
      studentTermId: input.requestJoinGroup.studentTermId!,
    });

    let groupMember = GroupMember.create({
      studentTerm: input.studentTerm,
      group: input.group,
    });

    groupMember = await this.groupMemberDao.insertEntity(groupMember);

    input.group.members?.push(groupMember);
    await this.notification(input.group, input.studentTerm);
    return groupMember.toJSON;
  }
  private async checkAccepRequestJoinHandler(input: ValidatedInput) {
    // check valid
    const members = await this.groupMemberDao.findByGroupId(
      input.requestJoinGroup.groupId!
    );
    const me = members.find((e) => e.studentTermId === input.studentTerm.id!);
    if (!me) {
      throw new ErrorCode(
        "STUDENT_DONT_HAVE_PERMISSIONS",
        "Can't accep because You are not member in group"
      );
    }
  }
  private async checkAccepInviteHandler(input: ValidatedInput) {
    // check authorization
    if (input.studentTerm.id != input.requestJoinGroup.studentTermId) {
      throw new ErrorCode(
        "STUDENT_DONT_HAVE_PERMISSIONS",
        "Can't accep because You are not invited"
      );
    }
  }
  async notification(group: Group, studentTerm: StudentTerm) {
    const student = await this.studentDao.findEntityById(studentTerm.studentId);
    const members = await this.groupMemberDao.findByGroupId(group.id!);
    for (const member of members) {
      await NotificationStudentService.send({
        user: member.studentTerm!,
        message: `'${student?.name}' vừa được thêm vào nhóm bạn`,
        type: "NEW_GROUP_MEMBER",
      });
    }
  }
}
