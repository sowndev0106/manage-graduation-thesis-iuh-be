import Student from "@core/domain/entities/Student";
import StudentDaoCore from "@core/infrastructure/objection-js/daos/StudentDao";
import IStudentDao from "@lecturer/domain/daos/IStudentDao";
import { injectable } from "inversify";

@injectable()
export default class StudentDao extends StudentDaoCore implements IStudentDao {
  async findAll(termId: number, isTopicExists: Boolean): Promise<Student[]> {
    const query = this.initQuery();
    query
      .join("student_term", "student_term.student_id", "student.id")
      .where({ "student_term.term_id": termId });
    query.leftJoin(
      "group_member",
      "group_member.student_term_id",
      "student.id"
    );
    query.leftJoin("group", "group_member.group_id", "group.id");

    if (isTopicExists != undefined) {
      if (isTopicExists) {
        // get student have group and topic in term
        query
          .andWhere({ "group.term_id": termId })
          .andWhereRaw("group.topic_id is not null");
      } else {
        // get student don't have group and topic  in term
        query.andWhereRaw(
          "(`group`.`term_id` is null) or (`group`.`term_id` = " +
            termId +
            " and `group`.`topic_id` is null)"
        );
      }
    }
    query.orderBy("updated_at", "desc");
    const result = await query.execute();

    return result && result.map((e) => this.convertModelToEntity(e));
  }

  async findByUsername(username: string): Promise<Student | null> {
    const query = this.initQuery();

    query.where("username", username);

    const result = await query.execute();
    return result && result[0] ? this.convertModelToEntity(result[0]) : null;
  }
}
