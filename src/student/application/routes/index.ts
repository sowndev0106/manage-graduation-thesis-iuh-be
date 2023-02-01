import { Request, Response, Router } from 'express';
import authenticationRoute from './authentication';
import userRoute from './user';
import studentAuthentication from '../middlewares/studentAuthentication';
const router = Router();

// public api
router.use('/auth', authenticationRoute);

// authorization api student
router.use(studentAuthentication);

router.use('/user', userRoute);

export default router;
