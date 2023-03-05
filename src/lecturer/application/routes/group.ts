import { Router } from 'express';
import GroupController from '../controllers/GroupController';
import LecturerAuth from '../middlewares/LecturerAuth';

const router = Router();

router.post('/', GroupController.createGroup);
// router.put('/:id', LecturerAuth.admin, GroupController.updateGroup);
// router.delete('/:id', LecturerAuth.admin, GroupController.deleteGroup);

// router.get('/', GroupController.getListGroup);
// router.get('/:id', GroupController.getGroupById);
export default router;
