import { Router } from 'express';
import TermController from '../controllers/TermController';

const router = Router();

router.post('/', TermController.createTerm);
router.put('/:id', TermController.updateTerm);
router.get('/', TermController.getListTerm);
router.get('/:id', TermController.getTermById);
router.delete('/:id', TermController.deleteTerm);

export default router;
