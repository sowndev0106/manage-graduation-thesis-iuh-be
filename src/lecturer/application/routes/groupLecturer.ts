import { Router } from 'express';
import GroupLecturerController from '../controllers/GroupLecturerController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', GroupLecturerController.createGroupLecturer);
router.get('/', GroupLecturerController.getListGroupLecturer);
router.get('/:id', GroupLecturerController.getGroupLecturerById);
router.put('/:id', LecturerAuth.headLecturer, GroupLecturerController.updateGroupLecturer);
router.delete('/:id', LecturerAuth.headLecturer, GroupLecturerController.deleteGroupLecturer);

router.post('/:id/members/:lecturerId', LecturerAuth.headLecturer, GroupLecturerController.addMember);
router.delete('/:id/members/:lecturerId', LecturerAuth.headLecturer, GroupLecturerController.deleteMember);

export default router;
