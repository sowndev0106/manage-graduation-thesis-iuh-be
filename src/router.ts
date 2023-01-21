import { Router } from 'express';
import ErrorHandler from '@core/application/middlewares/ErrorHandler';
import coreRoutes from '@core/application/routes';
import studentRoutes from '@student/application/routes';
import lecturerRoutes from '@lecturer/application/routes';
import adminRoutes from '@admin/application/routes';

const router = Router();

router.use('/api', coreRoutes);
router.use('/api/students', studentRoutes);
router.use('/api/lecturer', lecturerRoutes);
router.use('/api/admin', adminRoutes);

router.use(ErrorHandler);

export default router;