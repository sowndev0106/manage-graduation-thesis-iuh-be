import { Router } from 'express';
import TermController from '../controllers/TermController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', LecturerAuth.headLecturer, TermController.createTerm);
router.put('/:id', LecturerAuth.headLecturer, TermController.updateTerm);
router.delete('/:id', LecturerAuth.headLecturer, TermController.deleteTerm);

router.get('/', TermController.getListTerm);
router.get('/:id', TermController.getTermById);

export default router;
