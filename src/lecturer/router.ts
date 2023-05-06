import { Router } from 'express';
import errorHandler from '@core/application/middlewares/errorHandlerMiddlewares';
import coreRoutes from '@core/application/routes';
import studentRoutes from '@student/application/routes';
import lecturerRoutes from '@lecturer/application/routes';

const router = Router();

router.use('/api', lecturerRoutes);

router.use(errorHandler);

export default router;
