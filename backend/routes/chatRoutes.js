import express from 'express';
import { handleChat } from '../controllers/chatControllers.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalProtect, handleChat);

export default router;
