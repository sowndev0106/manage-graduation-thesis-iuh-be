import { Router } from 'express';
import uploadCloudinary from '@core/infrastructure/cloudinary';
import MeController from '../controllers/MeController';

const router = Router();

router.get('/', MeController.getMyInfo);
router.get('/notifications', MeController.getMyNotification);
router.patch('/password', MeController.updateMyPassword);
router.put('/', uploadCloudinary.single('avatar'), MeController.updateMyInfo);

export default router;
