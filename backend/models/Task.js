import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        dueDate: {
            type: Date,
        },
        // AI-Generated fields
        subtasks: [subtaskSchema],
        aiProductivityTips: [
            {
                type: String,
            },
        ],
        aiPriorityReason: {
            type: String,
            default: '',
        },
        aiSolution: {
            type: String,
            default: '',
        },

    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
