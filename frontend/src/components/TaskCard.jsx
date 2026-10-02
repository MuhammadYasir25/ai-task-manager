import React, { useState } from 'react';
import {
    Sparkles,
    Trash2,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Calendar,
    Zap,
    Copy,
    Check
} from 'lucide-react';
import API from '../api';

const priorityColors = {
    Urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Medium: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

const statusColors = {
    pending: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    'in-progress': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    completed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
};

export default function TaskCard({ task, onUpdateTask, onDeleteTask }) {
    const [expandedAI, setExpandedAI] = useState(false);
    const [expandedSolution, setExpandedSolution] = useState(Boolean(task.aiSolution));
    const [analyzing, setAnalyzing] = useState(false);
    const [solving, setSolving] = useState(false);
    const [copied, setCopied] = useState(false);

    const totalSubtasks = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
    const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    const handleToggleSubtask = async (subtaskId) => {
        try {
            const { data } = await API.patch(`/tasks/${task._id}/subtasks/${subtaskId}`);
            onUpdateTask(data);
        } catch (err) {
            console.error('Failed to toggle subtask:', err);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const { data } = await API.put(`/tasks/${task._id}`, { status: newStatus });
            onUpdateTask(data);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleTriggerAI = async () => {
        setAnalyzing(true);
        try {
            const { data } = await API.post(`/tasks/${task._id}/analyze`);
            onUpdateTask(data);
            setExpandedAI(true);
        } catch (err) {
            console.error('Failed to analyze task:', err);
        } finally {
            setAnalyzing(false);
        }
    };

    // Execute / Solve task with AI
    const handleSolveTask = async () => {
        setSolving(true);
        try {
            const { data } = await API.post(`/tasks/${task._id}/solve`);
            onUpdateTask(data);
            setExpandedSolution(true);
        } catch (err) {
            console.error('Failed to execute task:', err);
        } finally {
            setSolving(false);
        }
    };

    const handleCopy = () => {
        if (task.aiSolution) {
            navigator.clipboard.writeText(task.aiSolution);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition flex flex-col justify-between group">

            <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                        {task.priority} Priority
                    </span>

                    <div className="flex items-center space-x-2">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border bg-slate-950 cursor-pointer focus:outline-none ${statusColors[task.status] || statusColors.pending}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button
                            onClick={() => onDeleteTask(task._id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                            title="Delete task"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className={`text-base font-semibold text-white mb-1.5 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                </h3>
                {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {task.description}
                    </p>
                )}

                {/* Subtask Progress Bar */}
                {totalSubtasks > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Subtasks List */}
                {totalSubtasks > 0 && (
                    <div className="space-y-2 mb-4">
                        {task.subtasks.map((sub) => (
                            <label
                                key={sub._id}
                                className="flex items-start space-x-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none bg-slate-950/60 border border-slate-800/80 p-2 rounded-lg"
                            >
                                <input
                                    type="checkbox"
                                    checked={sub.completed}
                                    onChange={() => handleToggleSubtask(sub._id)}
                                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 mt-0.5"
                                />
                                <span className={sub.completed ? 'line-through text-slate-500' : ''}>
                                    {sub.title}
                                </span>
                            </label>
                        ))}
                    </div>
                )}

                {/* AI Output / Solution Box */}
                {task.aiSolution && (
                    <div className="mt-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl overflow-hidden">
                        <div className="p-2.5 flex items-center justify-between text-xs font-medium text-emerald-300 bg-emerald-950/30">
                            <div className="flex items-center space-x-1.5">
                                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                <span>AI Execution Result</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleCopy}
                                    className="text-emerald-400 hover:text-white flex items-center gap-1 transition"
                                    title="Copy Solution"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                                <button onClick={() => setExpandedSolution(!expandedSolution)}>
                                    {expandedSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        {expandedSolution && (
                            <div className="p-3 border-t border-emerald-500/20 text-xs text-slate-300 bg-slate-950/50 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                                {task.aiSolution}
                            </div>
                        )}
                    </div>
                )}

                {/* AI Insights & Productivity Tips Panel */}
                {(task.aiPriorityReason || task.aiProductivityTips?.length > 0) && (
                    <div className="mt-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setExpandedAI(!expandedAI)}
                            className="w-full p-2.5 flex items-center justify-between text-xs font-medium text-indigo-300 hover:bg-indigo-500/10 transition"
                        >
                            <div className="flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Claude AI Insights & Tips</span>
                            </div>
                            {expandedAI ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {expandedAI && (
                            <div className="p-3 border-t border-indigo-500/20 space-y-2.5 text-xs text-slate-300 bg-slate-950/40">
                                {task.aiPriorityReason && (
                                    <div>
                                        <span className="font-semibold text-indigo-300">Priority Reason: </span>
                                        <span className="text-slate-400">{task.aiPriorityReason}</span>
                                    </div>
                                )}
                                {task.aiProductivityTips?.length > 0 && (
                                    <div>
                                        <span className="font-semibold text-indigo-300 block mb-1">Productivity Tips:</span>
                                        <ul className="space-y-1 list-disc list-inside text-slate-400">
                                            {task.aiProductivityTips.map((tip, idx) => (
                                                <li key={idx} className="leading-tight">{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Card Footer: Due Date & Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                    </span>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleTriggerAI}
                        disabled={analyzing}
                        className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition font-medium disabled:opacity-50"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                        <span>{analyzing ? 'Thinking...' : 'AI Tips'}</span>
                    </button>

                    <button
                        onClick={handleSolveTask}
                        disabled={solving}
                        className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition font-medium disabled:opacity-50"
                    >
                        <Zap className={`w-3.5 h-3.5 ${solving ? 'animate-spin' : ''}`} />
                        <span>{solving ? 'Executing...' : '⚡ Solve'}</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
