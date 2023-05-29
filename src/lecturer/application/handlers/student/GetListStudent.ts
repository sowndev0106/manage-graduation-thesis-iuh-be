import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import ILecturerDao from "@lecturer/domain/daos/ILecturerDao";
import EntityId from "@core/domain/validate-objects/EntityID";
import BooleanValidate from "@core/domain/validate-objects/BooleanValidate";
import IStudentDao from "@lecturer/domain/daos/IStudentDao";
import Student from "@core/domain/entities/Student";

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
    let studentsJson: any[] = [];
    if (input.isTopicExists != undefined) {
      const students = await this.studentDao.findAll(
        input.termId,
        input.isTopicExists
      );
      studentsJson = students?.map((e) => {
        return { ...e.toJSON, isTopicExists: input.isTopicExists };
      });
    } else {
      const studentExistsTopic = await this.studentDao.findAll(
        input.termId,
        true
      );
      const studentNotExistsTopic = await this.studentDao.findAll(
        input.termId,
        false
      );

      studentsJson.concat(
        studentExistsTopic?.map((e) => {
          return { ...e.toJSON, isTopicExists: true };
        })
      );
      studentsJson.concat(
        studentNotExistsTopic?.map((e) => {
          return { ...e.toJSON, isTopicExists: false };
        })
      );
      studentsJson = studentsJson.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return studentsJson;
  }
}
