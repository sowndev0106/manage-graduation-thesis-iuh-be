import { Request, Response, Router } from 'express';
import AuthenticationController from '../controllers/AuthenticationController';

const router = Router();

router.post('/send-mail-reset-password', AuthenticationController.sendEmailResetPassword);
router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);
router.post('/refresh-token', AuthenticationController.refreshToken);

export default router;
