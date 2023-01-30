import { Request, Response, Router } from 'express';
import authenticationRoute from './authentication';
const router = Router();

router.use('/auth', authenticationRoute);

export default router;
