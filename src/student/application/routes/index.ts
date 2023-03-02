import { Request, Response, Router } from 'express';
import authenticationRoute from './authentication';
import meRoute from './me';
import termRoute from './term';
import majorsRoute from './majors';
import lecturerRoute from './lecturer';
import studentRoute from './student';
import topicRoute from './topic';
import studentAuthentication from '../middlewares/studentAuthentication';
const router = Router();

// public api
router.use('/auth', authenticationRoute);

// authorization api student
router.use(studentAuthentication);

router.use('/me', meRoute);
router.use('/terms', termRoute);
router.use('/majors', majorsRoute);
router.use('/lecturers', lecturerRoute);
router.use('/topics', topicRoute);
router.use('/students', studentRoute);

export default router;
