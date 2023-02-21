import { Request, Response, Router } from 'express';
import authRoute from './auth';
import userRoute from './user';
import adminRoute from './admin';
import termRoute from './term';
import majorsRoute from './majors';
import { adminAuth, lecturerAuth } from '../middlewares/LecturerAuth';
const router = Router();

// public api
router.use('/auth', authRoute);

// authorization api Lecturer
router.use(lecturerAuth);

router.use('/user', userRoute);
router.use('/term', termRoute);
router.use('/majors', majorsRoute);

// authorization api Admin
router.use(adminAuth);

router.use('/admin', adminRoute);

export default router;
