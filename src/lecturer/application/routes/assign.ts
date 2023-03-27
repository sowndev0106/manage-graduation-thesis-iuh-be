import { Router } from 'express';
import AssignController from '../controllers/AssignController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', AssignController.createAssign);
router.get('/', AssignController.getListAssign);
router.get('/:id', AssignController.getAssignById);
router.put('/:id', LecturerAuth.headLecturer, AssignController.updateAssign);
router.delete('/:id', LecturerAuth.headLecturer, AssignController.deleteAssign);

export default router;
