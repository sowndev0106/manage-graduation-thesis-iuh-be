import { Router } from 'express';
import EvaluationDetailController from '../controllers/EvaluationDetailController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', EvaluationDetailController.createEvaluationDetail);
router.get('/', EvaluationDetailController.getListEvaluationDetail);
router.get('/:id', EvaluationDetailController.getEvaluationDetailById);
router.put('/:id', LecturerAuth.headLecturer, EvaluationDetailController.updateEvaluationDetail);
router.delete('/:id', LecturerAuth.headLecturer, EvaluationDetailController.deleteEvaluationDetail);

export default router;
