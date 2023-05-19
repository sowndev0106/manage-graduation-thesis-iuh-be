import { Router } from "express";
import EvaluationController from "../controllers/EvaluationController";
import LecturerAuth from "../middlewares/LecturerAuth";

const router = Router();

router.post("/", EvaluationController.createEvaluation);
router.get("/", EvaluationController.getListEvaluation);
router.get(
  "/pdf/assigns/:assignId/download",
  EvaluationController.exportPDFEvaluationByGroup
);
router.get("/pdf/download", EvaluationController.generateEvaluation);
router.get("/:id", EvaluationController.getEvaluationById);
router.put(
  "/:id",
  LecturerAuth.headLecturer,
  EvaluationController.updateEvaluation
);
router.delete(
  "/:id",
  LecturerAuth.headLecturer,
  EvaluationController.deleteEvaluation
);

export default router;
