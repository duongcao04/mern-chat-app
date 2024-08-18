import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import {
	getConversationForSidebar,
	deleteConversation,
	recoverConversation,
	starConversation,
	unstarConversation
} from '../controllers/conversation.controller.js';

const router = express.Router();

router.get('/', protectRoute, getConversationForSidebar);
router.put('/delete/:id', deleteConversation);
router.put('/recover/:id', recoverConversation);
router.put('/star/:id', starConversation);
router.put('/unstar/:id', unstarConversation);

export default router;
