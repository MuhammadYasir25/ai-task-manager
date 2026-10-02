import User from '../models/user.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';

// @desc    Get system-wide stats & health
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const aiSolvedTasks = await Task.countDocuments({ aiSolution: { $ne: '' } });

        res.json({
            totalUsers,
            totalTasks,
            completedTasks,
            aiSolvedTasks,
            serverUptime: `${Math.floor(process.uptime() / 60)} minutes`,
            nodeVersion: process.version,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error loading admin stats', error: error.message });
    }
};

// @desc    Get all users with their task counts
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        const usersWithStats = await Promise.all(
            users.map(async (u) => {
                const total = await Task.countDocuments({ user: u._id });
                const completed = await Task.countDocuments({ user: u._id, status: 'completed' });
                return {
                    ...u.toObject(),
                    taskCount: total,
                    completedCount: completed,
                };
            })
        );

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: 'Error loading users', error: error.message });
    }
};

// @desc    Admin: Create new user manually
// @route   POST /api/admin/users
export const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// @desc    Admin: Update user details & role
// @route   PUT /api/admin/users/:id
export const updateUserByAdmin = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (role) user.role = role;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// @desc    Admin: Delete user and their tasks
// @route   DELETE /api/admin/users/:id
export const deleteUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Safety: Prevent deleting the super admin account
        if (user.role === 'admin' || user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Super Admin account cannot be deleted' });
        }

        await Task.deleteMany({ user: user._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and their tasks removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// @desc    Admin: View all system-wide user tasks / activity log
// @route   GET /api/admin/tasks
export const getAllSystemTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error loading system tasks', error: error.message });
    }
};
