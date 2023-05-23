import Term from "@core/domain/entities/Term";
import ErrorCode from "@core/domain/errors/ErrorCode";
type timeNow =
  | "SUBMIT_TOPIC"
  | "CHOOSE_TOPIC"
  | "DISCUSSION"
  | "REPORT"
  | "UPDATE_GROUP";
export default function checkDateTerm(term: Term, time: timeNow) {
  const dateNow = new Date();
  if (term.startDate > dateNow) {
    throw new ErrorCode(
      "TERM_HAS_NOT_STARTED",
      `Term has not started yet: start term = ${term.startDate.toLocaleDateString()}`
    );
  }
  if (term.endDate < dateNow) {
    throw new ErrorCode(
      "TERM_HAS_EXPRIED",
      `Term has expried: end term = ${term.endDate.toLocaleDateString()}`
    );
  }
  switch (time) {
    case "SUBMIT_TOPIC": {
      if (dateNow > term.startDateChooseTopic) {
        throw new ErrorCode(
          "TERM_SUBMIT_TOPIC_HAS_EXPRIED",
          `Thời gian tạo/sửa đề tài đã hết hạn vào ${term.startDateChooseTopic.toLocaleDateString()}`
        );
      }

      return;
    }
    case "CHOOSE_TOPIC": {
      if (dateNow < term.startDateChooseTopic) {
        throw new ErrorCode(
          "TERM_CHOOSE_TOPIC_HAS_NOT_STARTED",
          `Thời gian chọn / hủy đề tài bắt đầu vào ngày ${term.startDateChooseTopic.toLocaleDateString()}`
        );
      } else if (dateNow > term.endDateChooseTopic) {
        throw new ErrorCode(
          "TERM_CHOOSE_TOPIC_HAS_EXPRIED",
          `Thời gian chọn / hủy đề tài đã kết thúc vào ngày ${term.endDateChooseTopic.toLocaleDateString()}`
        );
      }
      return;
    }
    case "DISCUSSION": {
      if (dateNow < term.startDateDiscussion) {
        throw new ErrorCode(
          "TERM_DISCUSSION_HAS_NOT_STARTED",
          `Thời gian phân công và chấm điểm phản biện bắt đầu vào ngày ${term.startDateDiscussion.toLocaleDateString()}`
        );
      } else if (dateNow > term.endDateDiscussion) {
        throw new ErrorCode(
          "TERM_DISCUSSION_HAS_EXPRIED",
          `Thời gian phân công và chấm điểm phản biện đã kết thúc vào ngày ${term.endDateDiscussion.toLocaleDateString()}`
        );
      }
      return;
    }
    case "REPORT": {
      if (dateNow < term.startDateReport) {
        throw new ErrorCode(
          "TERM_REPORT_HAS_NOT_STARTED",
          `Thời gian phân công và chấm điểm hội đồng bắt đầu vào ngày ${term.startDateReport.toLocaleDateString()}`
        );
      } else if (dateNow > term.endDateReport) {
        throw new ErrorCode(
          "TERM_REPORT_HAS_EXPRIED",
          `Thời gian phân công và chấm điểm hội đồng đã kết thúc vào ngày ${term.endDateReport.toLocaleDateString()}`
        );
      }
      return;
    }
    case "UPDATE_GROUP": {
      if (dateNow > term.startDateChooseTopic) {
        throw new ErrorCode(
          "TERM_REPORT_HAS_EXPRIED",
          `Thời gian tạo / cập nhật nhóm đã kết thúc vào ngày ${term.startDateChooseTopic.toLocaleDateString()}`
        );
      }
      return;
    }
    default:
      break;
  }
}
