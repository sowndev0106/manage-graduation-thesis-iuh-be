import { Router } from 'express';
import TopicController from '../controllers/TopicController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.put('/:id/review', TopicController.reviewTopic);

router.post('/', TopicController.createTopic);
router.put('/:id', TopicController.updateTopic);
router.delete('/:id', TopicController.deleteTopic);

router.get('/', TopicController.getListTopic);
router.get('/:id', TopicController.getTopicById);
export default router;
