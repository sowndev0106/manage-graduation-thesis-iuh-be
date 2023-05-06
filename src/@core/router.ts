import { Router } from 'express';
import errorHandler from '@core/application/middlewares/errorHandlerMiddlewares';
import coreRoutes from '@core/application/routes';

const router = Router();

router.use('/', coreRoutes);

router.use(errorHandler);

export default router;
