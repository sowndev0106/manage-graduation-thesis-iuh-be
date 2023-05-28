import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import ILecturerDao from "@lecturer/domain/daos/ILecturerDao";
import EntityId from "@core/domain/validate-objects/EntityID";
import BooleanValidate from "@core/domain/validate-objects/BooleanValidate";
import IStudentDao from "@lecturer/domain/daos/IStudentDao";

interface ValidatedInput {
  termId: number;
  isTopicExists: boolean;
}

@injectable()
export default class GetListStudent extends RequestHandler {
  @inject("StudentDao") private studentDao!: IStudentDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const termId = this.errorCollector.collect("termId", () =>
      EntityId.validate({ value: request.query["termId"], required: false })
    );
    const isTopicExists = this.errorCollector.collect("isTopicExists", () =>
      BooleanValidate.validate({
        value: request.query["isTopicExists"]!,
        required: false,
      })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }

    return { termId, isTopicExists };
  }

  async handle(request: Request) {
    const input = await this.validate(request);

    const students = await this.studentDao.findAll(
      input.termId,
      input.isTopicExists
    );

    return students?.map((e) => e.toJSON);
  }
}
