import { Router } from 'express';
import TermController from '../controllers/TermController';

const router = Router();

router.get('/', TermController.getListTerm);
router.get('/last-term', TermController.getLastTerm);
router.get('/:id', TermController.getTermById);

export default router;
