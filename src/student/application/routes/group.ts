import { Router } from 'express';
import GroupController from '../controllers/GroupController';

const router = Router();
// group
router.post('/', GroupController.createGroup);
router.get('/', GroupController.getListGroup);
router.get('/me', GroupController.getMyGroup);
router.get('/:id', GroupController.getGroupById);
router.delete('/', GroupController.outGroup);

// invite join
router.post('/invites/send', GroupController.sendInviteJoinGroup);
router.get('/invites/send', GroupController.getAllInviteJoinGroup);
router.post('/:id/requests/send', GroupController.sendRequestJoinGroup);
router.get('/requests/send', GroupController.getAllMyRequestJoinGroup);

router.get('/requests/recive', GroupController.getAllRequestJoinMyGroup);
router.get('/invite/recive', GroupController.getAllRequestJoinMyGroup);

// request

export default router;
