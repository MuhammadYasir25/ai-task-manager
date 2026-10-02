import Task from '../models/Task.js';
import { analyzeTaskWithClaude, executeTaskWithClaude } from '../services/claudeService.js';

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        const { status, priority } = req.query;
        const filter = { user: req.user._id };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
};

// @desc    Create a new task (with optional AI processing)
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, autoAnalyze } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        let subtasks = [];
        let aiPriorityReason = '';
        let aiProductivityTips = [];
        let finalPriority = priority || 'Medium';
        let finalDueDate = dueDate;

        if (autoAnalyze) {
            const aiAnalysis = await analyzeTaskWithClaude(title, description);
            subtasks = aiAnalysis.subtasks || [];
            aiPriorityReason = aiAnalysis.priorityReason || '';
            aiProductivityTips = aiAnalysis.productivityTips || [];
            finalPriority = aiAnalysis.priority || finalPriority;

            if (!finalDueDate && aiAnalysis.suggestedDaysToComplete) {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + aiAnalysis.suggestedDaysToComplete);
                finalDueDate = targetDate;
            }
        }

        const task = await Task.create({
            user: req.user._id,
            title,
            description,
            priority: finalPriority,
            dueDate: finalDueDate,
            subtasks,
            aiPriorityReason,
            aiProductivityTips,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// @desc    Trigger AI analysis on an existing task
// @route   POST /api/tasks/:id/analyze
// @access  Private
export const triggerAIAnalysis = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const aiAnalysis = await analyzeTaskWithClaude(task.title, task.description);

        task.subtasks = aiAnalysis.subtasks || task.subtasks;
        task.priority = aiAnalysis.priority || task.priority;
        task.aiPriorityReason = aiAnalysis.priorityReason || task.aiPriorityReason;
        task.aiProductivityTips = aiAnalysis.productivityTips || task.aiProductivityTips;

        if (!task.dueDate && aiAnalysis.suggestedDaysToComplete) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + aiAnalysis.suggestedDaysToComplete);
            task.dueDate = targetDate;
        }

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing task with AI', error: error.message });
    }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// @desc    Toggle a subtask completion status
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const toggleSubtask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);
        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        subtask.completed = !subtask.completed;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating subtask', error: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task removed successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};
// @desc    Execute/Solve task with AI
// @route   POST /api/tasks/:id/solve
// @access  Private
export const solveTaskWithAI = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const solution = await executeTaskWithClaude(task.title, task.description);
        task.aiSolution = solution;
        task.status = 'completed'; // Auto-mark completed once solved!
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error solving task with AI', error: error.message });
    }
};
