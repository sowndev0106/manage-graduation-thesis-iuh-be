import { Request, Response, Router } from 'express';
import AuthenticationController from '../controllers/AuthenticationController';

const router = Router();

router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);

export default router;
