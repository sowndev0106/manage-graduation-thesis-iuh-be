import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import StudentController from '../controllers/StudentController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/import-my-student', LecturerAuth.headLecturer, uploadMulter.single('file'), StudentController.importStudentByExcel);
router.post('/import-student', LecturerAuth.admin, uploadMulter.single('file'), StudentController.importStudentByExcel);

export default router;
