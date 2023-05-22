import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import EntityId from "@core/domain/validate-objects/EntityID";
import IGroupDao from "@lecturer/domain/daos/IGroupDao";
import IGroupMemberDao from "@lecturer/domain/daos/IGroupMemberDao";
import ITermDao from "@lecturer/domain/daos/ITermDao";
import ITopicDao from "@lecturer/domain/daos/ITopicDao";

interface ValidatedInput {
  groupLecturerId: number;
}

@injectable()
export default class GetListGroupByGroupLecturerHandler extends RequestHandler {
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("TermDao") private termDao!: ITermDao;
  @inject("TopicDao") private topicDao!: ITopicDao;
  @inject("GroupMemberDao") private groupMemberDao!: IGroupMemberDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const groupLecturerId = this.errorCollector.collect("groupLecturerId", () =>
      EntityId.validate({
        value: request.params["groupLecturerId"],
      })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }

    return { groupLecturerId };
  }

  async handle(request: Request) {
    const input = await this.validate(request);

    const groups = await this.groupDao.findByGroupLecturerId(
      input.groupLecturerId
    );

    return groups.map((e) => e.toJSON);
  }
}
