import { Router } from 'express';
import errorHandler from '@core/application/middlewares/errorHandler';
import coreRoutes from '@core/application/routes';
import studentRoutes from '@student/application/routes';
import lecturerRoutes from '@lecturer/application/routes';
import adminRoutes from '@admin/application/routes';

const router = Router();

router.use('/api', coreRoutes);
router.use('/api/student', studentRoutes);
router.use('/api/lecturer', lecturerRoutes);
router.use('/api/admin', adminRoutes);

router.use(errorHandler);

export default router;
