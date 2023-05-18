import uploadMulter from '@core/infrastructure/multer';
import uploadCloudinary from '@core/infrastructure/cloudinary';
import { Router } from 'express';
import MeController from '../controllers/MeController';

const router = Router();

router.get('/', MeController.getMyInfo);
router.get('/notification', MeController.getMyNotification);
router.post('/notification/:notificationId/read', MeController.readNotification);
router.patch('/password', MeController.updateMyPassword);
router.put('/', uploadCloudinary.single('avatar'), MeController.updateMyInfo);

export default router;
