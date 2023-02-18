import upload from '@core/infrastructure/multer';
import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/', UserController.getMyInfo);
router.post('/import-student', upload.single('file'), UserController.importStudentByExcel);
router.post('/import-lecturer', upload.single('file'), UserController.importStudentByExcel);

export default router;
