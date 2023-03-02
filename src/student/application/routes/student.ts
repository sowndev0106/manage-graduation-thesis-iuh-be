import { Router } from 'express';
import StudentController from '../controllers/StudentController';
const router = Router();

router.get('/', StudentController.getListStudent);
router.get('/:id', StudentController.getStudentById);

export default router;
