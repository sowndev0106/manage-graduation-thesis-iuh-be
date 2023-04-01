import { Router } from 'express';
import TranscriptController from '../controllers/TranscriptController';

const router = Router();

router.post('/', TranscriptController.createOrUpdateTranscript);
router.get('/', TranscriptController.getListTranscript);

export default router;
