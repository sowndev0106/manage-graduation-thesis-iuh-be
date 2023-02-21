import { Router } from 'express';
import MajorsController from '../controllers/MajorsController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', LecturerAuth.admin, MajorsController.createMajors);
router.put('/:id', LecturerAuth.admin, MajorsController.updateMajors);
router.delete('/:id', LecturerAuth.admin, MajorsController.deleteMajors);

router.get('/', MajorsController.getListMajors);
router.get('/:id', MajorsController.getMajorsById);
export default router;
