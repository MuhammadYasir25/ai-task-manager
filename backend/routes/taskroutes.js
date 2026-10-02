import express from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    triggerAIAnalysis,
    toggleSubtask,
    solveTaskWithAI,
} from '../controllers/taskControllers.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

router.post('/:id/analyze', triggerAIAnalysis);
router.post('/:id/solve', solveTaskWithAI);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

export default router;
