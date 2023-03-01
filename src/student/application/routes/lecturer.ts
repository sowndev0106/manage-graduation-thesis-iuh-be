import { Router } from 'express';
import LecturerController from '../controllers/LecturerController';
const router = Router();

router.get('/', LecturerController.getListLecturer);

router.get('/:id', LecturerController.getLecturerById);

export default router;
