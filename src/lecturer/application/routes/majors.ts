import { Router } from 'express';
import MajorsController from '../controllers/MajorsController';

const router = Router();

router.post('/', MajorsController.createMajors);
router.put('/:id', MajorsController.updateMajors);
router.get('/', MajorsController.getListMajors);
router.get('/:id', MajorsController.getMajorsById);
router.delete('/:id', MajorsController.deleteMajors);

export default router;
