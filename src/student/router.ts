import { Router } from 'express';
import errorHandler from '@core/application/middlewares/errorHandlerMiddlewares';
import studentRoutes from '@student/application/routes';

const router = Router();

router.use('/api', studentRoutes);

router.use(errorHandler);

export default router;
