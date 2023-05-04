import { Router } from 'express';
import TermController from '../controllers/TermController';

const router = Router();

router.get('/', TermController.getListTerm);
router.get('/now', TermController.getTermNow);
router.get('/:id', TermController.getTermById);

export default router;
