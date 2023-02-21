import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import UserController from '../controllers/LecturerController';
import LecturerAuth from '../middlewares/LecturerAuth';
const router = Router();

router.get('/head-lecturers', UserController.listHeadLecturer);
// headLecturer role
router.post('/import-my-lecturer', LecturerAuth.headLecturer, uploadMulter.single('file'), UserController.importLecturerByExcel);
// admin role
router.post('/import-lecturer', LecturerAuth.admin, uploadMulter.single('file'), UserController.importLecturerByExcel);

export default router;
