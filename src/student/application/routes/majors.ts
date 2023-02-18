import { Router } from 'express';
import MajorsController from '../controllers/MajorsController';

const router = Router();

router.get('/', MajorsController.getListMajors);
router.get('/:id', MajorsController.getMajorsById);

export default router;
