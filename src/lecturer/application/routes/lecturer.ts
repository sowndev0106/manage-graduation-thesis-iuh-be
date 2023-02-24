import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import LecturerController from '../controllers/LecturerController';
import LecturerAuth from '../middlewares/LecturerAuth';
const router = Router();

router.get('/', LecturerController.getListLecturer);

// headLecturer role
router.post('/import-my-lecturer', LecturerAuth.headLecturer, uploadMulter.single('file'), LecturerController.importMyLecturerByExcel);

// admin role
router.post('/import-lecturer', LecturerAuth.admin, uploadMulter.single('file'), LecturerController.importLecturerByExcel);

export default router;
