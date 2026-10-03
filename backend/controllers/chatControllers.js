import Task from '../models/Task.js';
import { callGeminiAPI } from '../services/geminiService.js';

export const handleChat = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        let taskSummary = '';
        let userName = 'Guest';

        if (req.user) {
            userName = req.user.name || 'User';
            const userTasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

            taskSummary = userTasks.map(t => {
                const subtaskSummary = (t.subtasks || []).map(s => `${s.completed ? '[x]' : '[ ]'} ${s.title}`).join(', ');
                return `- Title: "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Subtasks: [${subtaskSummary || 'none'}]`;
            }).join('\n');
        }

        const systemInstruction = `You are the official AI Workspace Copilot for "AI Task Manager", powered by Google Gemini.
The user interacting with you is: ${userName}.

${req.user ? `Here is the user's current list of tasks in their personal private workspace:\n${taskSummary || 'The user currently has no tasks.'}` : 'The user is exploring the workspace.'}

Instructions:
1. Be helpful, concise, enthusiastic, and direct.
2. If the user asks about their tasks, summarize, prioritize, or guide them.
3. If the user asks to plan or break down a project, give them 3-5 clear sequential action steps.
4. You can format responses using markdown (bold, bullet points, numbers).
5. Always keep the user focused and motivated!`;

        let conversationPrompt = '';
        if (history && history.length > 0) {
            conversationPrompt = history.slice(-6).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n') + '\n';
        }
        conversationPrompt += `User: ${message}\nAssistant:`;

        const reply = await callGeminiAPI(conversationPrompt, systemInstruction);

        res.json({
            reply,
            authenticated: Boolean(req.user)
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: error.message || 'Failed to process chat with Gemini AI' });
    }
};
