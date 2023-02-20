import uploadMulter from '@core/infrastructure/multer';
import uploadCloudinary from '@core/infrastructure/cloudinary';
import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/', UserController.getMyInfo);
router.put('/', uploadCloudinary.single('avatar'), UserController.updateMyInfo);
router.post('/import-student', uploadMulter.single('file'), UserController.importStudentByExcel);
router.post('/import-lecturer', uploadMulter.single('file'), UserController.importLecturerByExcel);

export default router;
