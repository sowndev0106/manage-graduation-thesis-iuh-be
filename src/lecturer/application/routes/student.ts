import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import StudentController from '../controllers/StudentController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();
router.get('/', StudentController.getStudents);
router.post('/import-my-student', LecturerAuth.headLecturer, uploadMulter.single('file'), StudentController.importMyStudentByExcel);
router.post('/import-student', LecturerAuth.admin, uploadMulter.single('file'), StudentController.importStudentByExcel);

export default router;
