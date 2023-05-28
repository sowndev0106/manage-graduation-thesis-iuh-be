import { Router } from "express";
import GroupController from "../controllers/GroupController";
import LecturerAuth from "../middlewares/LecturerAuth";

const router = Router();

// group
router.patch(
  "/:id/type-report",
  LecturerAuth.headLecturer,
  GroupController.updateTypeReport
);
router.get("/", GroupController.getListGroup);
router.post("/grant-topic", GroupController.grantTopicGroup);
router.get(
  "/group-lecturer/:groupLecturerId",
  GroupController.getListGroupByGroupLecturer
);
router.get("/:id", GroupController.getGroupById);

export default router;
