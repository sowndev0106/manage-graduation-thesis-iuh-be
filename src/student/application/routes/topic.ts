import { Router } from 'express';
import TopicController from '../controllers/TopicController';

const router = Router();

router.get('/', TopicController.getListTopic);
router.get('/:id', TopicController.getTopicById);
export default router;
