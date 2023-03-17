import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import LecturerController from '../controllers/LecturerController';
import LecturerAuth from '../middlewares/LecturerAuth';
const router = Router();

router.get('/', LecturerController.getListLecturer);
router.get('/:id', LecturerController.getListLecturerById);

router.post('/import-lecturer', LecturerAuth.headLecturer, uploadMulter.single('file'), LecturerController.importLecturerByExcel);

export default router;
