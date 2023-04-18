import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import StudentController from '../controllers/StudentController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();
router.get('/', StudentController.getStudents);
router.get('/:id', StudentController.getStudentById);
router.post('/import-student', LecturerAuth.headLecturer, uploadMulter.single('file'), StudentController.importStudentByExcel);

export default router;
