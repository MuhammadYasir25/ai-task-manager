import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js';
import taskRoutes from './routes/taskroutes.js';
import adminRoutes from './routes/adminroutes.js';
import chatRoutes from './routes/chatRoutes.js'; // <-- Import here

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/chat', chatRoutes);
app.use('/api/api/chat', chatRoutes); // <-- Mount here

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'AI Task Manager API is running smoothly!',
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
