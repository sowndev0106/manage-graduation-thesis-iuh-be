import { Request, Response, Router } from 'express';
import authRoute from './auth';
import termRoute from './term';
import majorsRoute from './majors';
import topicRoute from './topic';
import meRoute from './me';
import lecturerRoute from './lecturer';
import studentRoute from './student';
import evaluationRoute from './evaluation';
import LecturerAuth from '../middlewares/LecturerAuth';
const router = Router();

// public api
router.use('/auth', authRoute);

router.use(LecturerAuth.lecturer);

router.use('/terms', termRoute);
router.use('/majors', majorsRoute);
router.use('/topics', topicRoute);
router.use('/lecturers', lecturerRoute);
router.use('/students', studentRoute);
router.use('/evaluations', evaluationRoute);
router.use('/me', meRoute);

export default router;
