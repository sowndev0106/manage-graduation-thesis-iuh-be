import { Router } from 'express';
import GroupController from '../controllers/GroupController';

const router = Router();

router.post('/', GroupController.createGroup);
router.get('/', GroupController.getListGroup);
router.get('/me', GroupController.getMyGroup);
router.get('/:id', GroupController.getGroupById);

// router.put('/:id', GroupController.updateGroup);
// router.delete('/:id', GroupController.deleteGroup);

// router.get('/', GroupController.getListGroup);
export default router;
