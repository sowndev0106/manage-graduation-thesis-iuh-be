import { Router } from 'express';
import TermController from '../controllers/TermController';

const router = Router();

router.post('/', TermController.createTerm);
router.put('/:id', TermController.updateTerm);
router.get('/', TermController.getListTerm);
router.get('/:id(d+)', TermController.getTermById);

export default router;
