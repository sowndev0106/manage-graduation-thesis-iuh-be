import { Router } from 'express';
import GroupController from '../controllers/GroupController';

const router = Router();
// topic
router.post('/topic', GroupController.chooseTopicGroup);
router.delete('/topic', GroupController.cancelTopicGroup);

// invite join
router.get('/group-requests', GroupController.getRequestJoinMyGroup);
router.get('/my-requests', GroupController.getMyRequestJoinGroup);

router.post('/group-invites', GroupController.sendInviteJoinGroup);
router.post('/:id/my-requests', GroupController.sendRequestJoinGroup);

router.delete('/refuse-request/:id', GroupController.refuseRequestJoinGroup);
router.post('/accep-request/:id', GroupController.refuseRequestJoinGroup);

// group
router.post('/', GroupController.createGroup);
router.get('/', GroupController.getListGroup);
router.get('/me', GroupController.getMyGroup);
router.get('/:id', GroupController.getGroupById);
router.delete('/', GroupController.outGroup);

export default router;
