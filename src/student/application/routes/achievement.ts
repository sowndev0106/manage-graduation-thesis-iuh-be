import { Router } from 'express';
import AchievementController from '../controllers/AchievementController';

const router = Router();

router.get('/', AchievementController.getListAchievement);
router.get('/:id', AchievementController.getAchievementById);

export default router;
