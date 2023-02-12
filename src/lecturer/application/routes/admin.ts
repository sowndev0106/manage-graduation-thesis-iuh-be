import { Router } from 'express';
import AdminController from '../controllers/AdminController';

const router = Router();

router.get('/user/import-excel', AdminController.addUserByExcel);

export default router;
