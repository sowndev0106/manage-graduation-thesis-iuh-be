import { Router } from "express";
import uploadMulter from "@core/infrastructure/multer";
import StudentController from "../controllers/StudentController";
import LecturerAuth from "../middlewares/LecturerAuth";

const router = Router();
router.get("/", StudentController.getStudents);
router.post("/", LecturerAuth.headLecturer, StudentController.addStudent);
router.get(
  "/export-transcript",
  LecturerAuth.headLecturer,
  StudentController.exportTranscript
);

router.patch(
  "/:studentId/reset-password",
  LecturerAuth.headLecturer,
  StudentController.resetPassword
);
router.get("/:id", StudentController.getStudentById);
router.post(
  "/import-student",
  LecturerAuth.headLecturer,
  uploadMulter.single("file"),
  StudentController.importStudentByExcel
);

export default router;
