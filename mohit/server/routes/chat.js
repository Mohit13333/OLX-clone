import express from 'express';
import { getChatMessages, getUserChats } from '../controllers/chat.js';

const router = express.Router();

router.get('/:roomId', getChatMessages);
router.get('/user/:userId', getUserChats);

export default router;