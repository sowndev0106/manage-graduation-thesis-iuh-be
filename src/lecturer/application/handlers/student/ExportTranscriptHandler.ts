import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import { Request } from "express";
import EntityId from "@core/domain/validate-objects/EntityID";
import NotFoundError from "@core/domain/errors/NotFoundError";
import ValidationError from "@core/domain/errors/ValidationError";
import IAssignDao from "@lecturer/domain/daos/IAssignDao";
import { TypeEvaluation } from "@core/domain/entities/Evaluation";
import IGroupLecturerDao from "@lecturer/domain/daos/IGroupLecturerDao";
import Student from "@core/domain/entities/Student";
import IStudentDao from "@lecturer/domain/daos/IStudentDao";
import IGroupMemberDao from "@lecturer/domain/daos/IGroupMemberDao";
import IGroupLecturerMemberDao from "@lecturer/domain/daos/IGroupLecturerMemberDao";
import IEvaluationDao from "@lecturer/domain/daos/IEvaluationDao";
import Transcript from "@core/domain/entities/Transcript";
import ITranscriptDao from "@lecturer/domain/daos/ITranscriptDao";
import Lecturer from "@core/domain/entities/Lecturer";
import ILecturerDao from "@lecturer/domain/daos/ILecturerDao";
import ITermDao from "@lecturer/domain/daos/ITermDao";
import IGroupDao from "@lecturer/domain/daos/IGroupDao";
import Term from "@core/domain/entities/Term";
import IAchievementDao from "@lecturer/domain/daos/IAchievementDao";
import StudentTerm from "@core/domain/entities/StudentTerm";
import IStudentTermDao from "@lecturer/domain/daos/IStudentTermDao";
import ILecturerTermDao from "@lecturer/domain/daos/ILecturerTermDao";
import LecturerTerm from "@core/domain/entities/LecturerTerm";
import ErrorCode from "@core/domain/errors/ErrorCode";
import XLSX from "xlsx";
import { binary } from "joi";
import { group } from "console";
interface ValidatedInput {
  term: Term;
}
interface IGraderByLecturerTerm {
  lecturerTermId: number;
  grade: number;
}
interface IGradeByTypeEluvation {
  avgGrader: number;
  sumGrade: number;
  count: number;
}

@injectable()
export default class ExportTranscriptHandler extends RequestHandler {
  @inject("GroupLecturerDao") private groupLecturerDao!: IGroupLecturerDao;
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("StudentDao") private studentDao!: IStudentDao;
  @inject("GroupMemberDao") private groupMemberDao!: IGroupMemberDao;
  @inject("GroupLecturerMemberDao")
  private groupLecturerMemberDao!: IGroupLecturerMemberDao;
  @inject("AssignDao") private assignDao!: IAssignDao;
  @inject("LecturerDao") private lecturerDao!: ILecturerDao;
  @inject("TermDao") private termDao!: ITermDao;
  @inject("EvaluationDao") private evaluationDao!: IEvaluationDao;
  @inject("TranscriptDao") private transcriptDao!: ITranscriptDao;
  @inject("AchievementDao") private achievementDao!: IAchievementDao;
  @inject("StudentTermDao") private studentTermDao!: IStudentTermDao;

  @inject("LecturerTermDao") private lecturerTermDao!: ILecturerTermDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const termId = this.errorCollector.collect("termId", () =>
      EntityId.validate({ value: request.query["termId"] })
    );
    const studentId = this.errorCollector.collect("studentId", () =>
      EntityId.validate({ value: request.query["studentId"] })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }

    let term = await this.termDao.findEntityById(termId);
    if (!term) throw new NotFoundError("term not found");
    return {
      term,
    };
  }
  async handle(request: Request) {
    const { term } = await this.validate(request);
    const listStudentTerm = await this.studentTermDao.findAll(term.id!);
    const listSummaryPromise = listStudentTerm.map(async (studentTerm) =>
      this.getSummaryByStudent(studentTerm)
    );
    const listSumary = await Promise.all(listSummaryPromise);
    let data = listSumary.map((sumary) => {
      if (!sumary.group || !sumary.group.topic) return null;
      return {
        MSSV: sumary.student.username,
        "Họ Tên": sumary.student.name,
        "Mã nhóm": sumary.group.id,
        "Tên nhóm": sumary.group.name,
        Email: sumary.student.email,
        "Mã GVHD": sumary.group?.topic?.lecturerTerm?.lecturer.username,
        "Tên GVHD": sumary.group?.topic?.lecturerTerm?.lecturer.name,
        "Mã đề tài": sumary.group?.topic?.id,
        "Tên đề tài": sumary.group?.topic?.name,
        "Điểm GVHD": sumary.ADVISOR.avgGrader,
        "Điểm Phản biện": sumary.REVIEWER.avgGrader,
        "Điểm Hội đồng": sumary.SESSION_HOST.avgGrader,
        "Điểm cộng": sumary.bonusGrade || 0,
        "Tổng tổng kết": sumary.gradeSummary,
      };
    });
    data = data.filter((e) => e != null);

    const ws = XLSX.utils.json_to_sheet(data);
    return ws;
  }
  async getSummaryByStudent(studentTerm: StudentTerm) {
    const transcriptByType: Record<TypeEvaluation, Array<Transcript>> = {
      ADVISOR: [],
      REVIEWER: [],
      SESSION_HOST: [],
    };

    transcriptByType.ADVISOR = await this.transcriptDao.findByStudentAndType({
      studentTermId: studentTerm.id!,
      type: TypeEvaluation.ADVISOR,
    });
    transcriptByType.REVIEWER = await this.transcriptDao.findByStudentAndType({
      studentTermId: studentTerm.id!,
      type: TypeEvaluation.REVIEWER,
    });
    transcriptByType.SESSION_HOST =
      await this.transcriptDao.findByStudentAndType({
        studentTermId: studentTerm.id!,
        type: TypeEvaluation.SESSION_HOST,
      });

    const gradeByType: Record<TypeEvaluation, IGradeByTypeEluvation> = {
      ADVISOR: {
        avgGrader: 0,
        sumGrade: 0,
        count: 0,
      },
      REVIEWER: {
        avgGrader: 0,
        sumGrade: 0,
        count: 0,
      },
      SESSION_HOST: {
        avgGrader: 0,
        sumGrade: 0,
        count: 0,
      },
    };

    gradeByType.ADVISOR =
      (await this.caculateAVGGrade(transcriptByType.ADVISOR)) || [];
    gradeByType.REVIEWER =
      (await this.caculateAVGGrade(transcriptByType.REVIEWER)) || [];
    gradeByType.SESSION_HOST =
      (await this.caculateAVGGrade(transcriptByType.SESSION_HOST)) || [];
    const avgGradeAdvisorReviewer =
      (gradeByType.REVIEWER.sumGrade + gradeByType.ADVISOR.sumGrade) /
      (gradeByType.REVIEWER.count + gradeByType.ADVISOR.count);
    let gradeSummary =
      (avgGradeAdvisorReviewer + gradeByType.SESSION_HOST.avgGrader) / 2;

    const achievements = await this.achievementDao.findAll({
      studentTermId: studentTerm.id!,
    });

    // add grade achievement
    const bonusGrade = achievements.reduce((num, e) => e.bonusGrade + num, 0);
    gradeSummary += bonusGrade;
    const group = await this.groupDao.findOne(studentTerm.id!);
    return {
      group: group,
      student: studentTerm.student,
      gradeSummary: gradeSummary > 10 ? 10 : gradeSummary,
      bonusGrade,
      ADVISOR: {
        avgGrader: gradeByType.ADVISOR.avgGrader,
      },
      REVIEWER: {
        avgGrader: gradeByType.REVIEWER.avgGrader,
      },
      SESSION_HOST: {
        avgGrader: gradeByType.SESSION_HOST.avgGrader,
      },
    };
  }
  async caculateAVGGrade(
    transcripts: Array<Transcript>
  ): Promise<IGradeByTypeEluvation> {
    const gradeByLecturer = new Map<number, IGraderByLecturerTerm>();
    let sumGrade = 0;
    for (const transcript of transcripts) {
      sumGrade += transcript.grade;
      const oldGrade = gradeByLecturer.get(transcript.lecturerTermId!);
      if (!oldGrade) {
        gradeByLecturer.set(transcript.lecturerTermId!, {
          grade: transcript.grade,
          lecturerTermId: transcript.lecturerTermId!,
        });
      } else {
        gradeByLecturer.set(transcript.lecturerTermId!, {
          grade: oldGrade.grade + transcript.grade,
          lecturerTermId: oldGrade.lecturerTermId,
        });
      }
    }
    const gradeByLecturers = Array.from(gradeByLecturer.values());
    return {
      avgGrader: sumGrade / gradeByLecturers.length,
      sumGrade: sumGrade,
      count: gradeByLecturers.length,
    };
  }
}
