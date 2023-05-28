import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import EntityId from "@core/domain/validate-objects/EntityID";
import ITermDao from "@lecturer/domain/daos/ITermDao";
import IGroupDao from "@lecturer/domain/daos/IGroupDao";
import IGroupMemberDao from "@lecturer/domain/daos/IGroupMemberDao";
import NotFoundError from "@core/domain/errors/NotFoundError";
import ITopicDao from "@lecturer/domain/daos/ITopicDao";
import IStudentDao from "@lecturer/domain/daos/IStudentDao";
import Student from "@core/domain/entities/Student";
import Topic from "@core/domain/entities/Topic";
import IStudentTermDao from "@lecturer/domain/daos/IStudentTermDao";
import ILecturerTermDao from "@lecturer/domain/daos/ILecturerTermDao";
import ErrorCode from "@core/domain/errors/ErrorCode";
import Group, { TypeStatusGroup } from "@core/domain/entities/Group";
import StudentTerm from "@core/domain/entities/StudentTerm";
import GroupMember from "@core/domain/entities/GroupMember";
import IAssignDao from "@lecturer/domain/daos/IAssignDao";
import IGroupLecturerDao from "@lecturer/domain/daos/IGroupLecturerDao";
import GroupLecturer from "@core/domain/entities/GroupLecturer";
import { TypeEvaluation } from "@core/domain/entities/Evaluation";
import GroupLecturerMember from "@core/domain/entities/GroupLecturerMember";
import Assign from "@core/domain/entities/Assign";
import IGroupLecturerMemberDao from "@lecturer/domain/daos/IGroupLecturerMemberDao";
import NotificationStudentService from "@core/service/NotificationStudentService";

interface ValidatedInput {
  student: Student;
  topic: Topic;
}

@injectable()
export default class GrantTopicGroupHandler extends RequestHandler {
  @inject("TermDao") private termDao!: ITermDao;
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("GroupMemberDao") private groupMemberDao!: IGroupMemberDao;
  @inject("TopicDao") private topicDao!: ITopicDao;
  @inject("StudentDao") private studentDao!: IStudentDao;
  @inject("LecturerTermDao") private lecturerDao!: ILecturerTermDao;
  @inject("StudentTermDao") private studentTermDao!: IStudentTermDao;
  @inject("AssignDao") private assignDao!: IAssignDao;
  @inject("GroupLecturerMemberDao")
  private groupLecturerMemberDao!: IGroupLecturerMemberDao;
  @inject("GroupLecturerDao") private groupLecturerDao!: IGroupLecturerDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const topicId = this.errorCollector.collect("topicId", () =>
      EntityId.validate({ value: String(request.body["topicId"]) })
    );
    const studentId = this.errorCollector.collect("studentId", () =>
      EntityId.validate({ value: String(request.body["studentId"]) })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }
    const topic = await this.topicDao.findEntityById(topicId);
    if (!topic) {
      throw new NotFoundError("Topic not found");
    }
    const student = await this.studentDao.findEntityById(studentId);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    return { topic, student };
  }

  async handle(request: Request) {
    const input = await this.validate(request);

    const lecturerTerm = await this.lecturerDao.findEntityById(
      input.topic.lecturerTermId!
    );
    const studentTerm = await this.studentTermDao.findOne(
      lecturerTerm?.termId!,
      input.student.id!
    );

    if (!studentTerm) {
      throw new ErrorCode("STUDENT_NOT_IN_TERM", "Student not in this term");
    }

    const groups = await this.groupDao.findAll(undefined, input.topic.id);

    if (input.topic.quantityGroupMax <= groups.length) {
      throw new ErrorCode("GROUP_MAX_QUALITY", "max quality topic");
    }

    let group = await this.findOrCreateGroupStudent(studentTerm);

    if (group.topic && group.topicId) {
      throw new ErrorCode(
        "GROUP_ALREADY_EXIST_TOPIC",
        "Student already exists group"
      );
    }

    group = await this.chooseTopic(group, input.topic);

    return group.toJSON;
  }

  async findOrCreateGroupStudent(studentTerm: StudentTerm): Promise<Group> {
    let group = await this.groupDao.findOne(studentTerm.id!);

    if (!group) {
      group = await this.groupDao.insertEntity(
        Group.create({
          status: TypeStatusGroup.OPEN,
          name: "",
          term: studentTerm.term,
        })
      );
      let member = GroupMember.create({ group, studentTerm });
      member = await this.groupMemberDao.insertEntity(member);
      group.update({ members: [member] });
    }

    return group;
  }
  async chooseTopic(group: Group, topic: Topic): Promise<Group> {
    // update group
    group.update({ topic });
    group.update({ name: String(topic.id) });
    await this.groupDao.updateEntity(group);

    // create assign
    await this.createAssign(group, topic);
    await NotificationStudentService.send({
      message: "Bạn vừa được giảng viên gán đề tài",
      type: "CHOOSE_TOPIC",
      user: group.members[0]?.studentTerm,
    });
    return group;
  }
  async createAssign(group: Group, topic: Topic) {
    // autho create assign advisor for lecturer of topic
    const groupLecturer = await this.groupLecturerDao.insertEntity(
      GroupLecturer.create({
        name: `ADVISOR -${topic.name} - ${group.id}`,
        term: group.term,
        type: TypeEvaluation.ADVISOR,
      })
    );
    const groupLecturerMember = await this.groupLecturerMemberDao.insertEntity(
      GroupLecturerMember.create({
        lecturerTerm: topic.lecturerTerm,
        groupLecturer,
      })
    );

    const assign = await this.assignDao.insertEntity(
      Assign.create({
        group,
        groupLecturer,
        typeEvaluation: TypeEvaluation.ADVISOR,
      })
    );
  }
}
