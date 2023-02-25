import { Router } from 'express';
import MeController from '../controllers/MeController';

const router = Router();

router.get('/', MeController.getMyInfo);

export default router;
