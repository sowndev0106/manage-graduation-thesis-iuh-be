import { Router } from 'express';
import AchievementController from '../controllers/AchievementController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', LecturerAuth.headLecturer, AchievementController.createAchievement);
router.get('/', AchievementController.getListAchievement);
router.get('/:id', AchievementController.getAchievementById);
router.put('/:id', LecturerAuth.headLecturer, AchievementController.updateAchievement);
router.delete('/:id', LecturerAuth.headLecturer, AchievementController.deleteAchievement);

export default router;
