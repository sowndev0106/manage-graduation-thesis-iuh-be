import { Request, Response, Router } from 'express';
import authRoute from './auth';
import termRoute from './term';
import majorsRoute from './majors';
import meRoute from './majors';
import LecturerAuth from '../middlewares/LecturerAuth';
const router = Router();

// public api
router.use('/auth', authRoute);

router.use(LecturerAuth.lecturer);

router.use('/terms', termRoute);
router.use('/majors', majorsRoute);
router.use('/me', meRoute);

export default router;
