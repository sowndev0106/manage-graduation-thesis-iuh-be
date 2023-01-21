import { Router } from 'express';
import testRoutes from './test';


const router = Router();

router.use('/test', testRoutes);


export default router;