import { Router } from 'express';
import GroupController from '../controllers/GroupController';

const router = Router();
// topic
router.post('/topic', GroupController.chooseTopicGroup);
router.delete('/topic', GroupController.cancelTopicGroup);

// group
router.post('/', GroupController.createGroup);
router.get('/', GroupController.getListGroup);
router.get('/me', GroupController.getMyGroup);
router.get('/:id', GroupController.getGroupById);
router.delete('/', GroupController.outGroup);

// invite join
router.post('/invites/send', GroupController.sendInviteJoinGroup);
router.post('/:id/requests/send', GroupController.sendRequestJoinGroup);

router.get('/requests/recive', GroupController.getAllRequestJoinMyGroup);

router.delete('/refuse-request/:id', GroupController.refuseRequestJoinGroup);

export default router;
