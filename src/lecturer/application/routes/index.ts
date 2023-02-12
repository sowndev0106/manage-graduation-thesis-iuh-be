import { Request, Response, Router } from 'express';
import authenticationRoute from './authentication';
import userRoute from './user';
import adminRoute from './admin';
import { adminAuthentication, lecturerAuthentication } from '../middlewares/LecturerAuthentication';
const router = Router();

// public api
router.use('/auth', authenticationRoute);

// authorization api Lecturer
router.use(lecturerAuthentication);

router.use('/user', userRoute);

// authorization api Admin
router.use(adminAuthentication);

router.use('/admin', adminRoute);

export default router;
