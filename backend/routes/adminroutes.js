import express from 'express';
import {
    getAdminStats,
    getAllUsers,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin,
    getAllSystemTasks,
} from '../controllers/adminControllers.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.post('/users', createUserByAdmin);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);
router.get('/tasks', getAllSystemTasks);

export default router;
