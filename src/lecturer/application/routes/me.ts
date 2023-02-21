import uploadMulter from '@core/infrastructure/multer';
import uploadCloudinary from '@core/infrastructure/cloudinary';
import { Router } from 'express';
import MeController from '../controllers/MeController';

const router = Router();

router.get('/', MeController.getMyInfo);
router.put('/', uploadCloudinary.single('avatar'), MeController.updateMyInfo);

export default router;
