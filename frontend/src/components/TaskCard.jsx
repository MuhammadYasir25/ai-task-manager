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
    Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    High: 'bg-amber-50 text-amber-800 border-amber-200',
    Medium: 'bg-blue-50 text-blue-700 border-blue-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const statusColors = {
    pending: 'text-amber-800 border-amber-200 bg-amber-50',
    'in-progress': 'text-blue-700 border-blue-200 bg-blue-50',
    completed: 'text-emerald-800 border-emerald-200 bg-emerald-50',
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
        <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">

            <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                        {task.priority} Priority
                    </span>

                    <div className="flex items-center space-x-2">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${statusColors[task.status] || statusColors.pending}`}
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

                <h3 className={`text-base font-semibold text-slate-900 mb-1.5 ${task.status === 'completed' ? 'line-through text-slate-600' : ''}`}>
                    {task.title}
                </h3>
                {task.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {task.description}
                    </p>
                )}

                {/* Subtask Progress Bar */}
                {totalSubtasks > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
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
                                className="flex items-start space-x-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/70 p-2.5 rounded-xl transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={sub.completed}
                                    onChange={() => handleToggleSubtask(sub._id)}
                                    className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-0 mt-0.5"
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
                    <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded-xl overflow-hidden shadow-2xs">
                        <div className="p-2.5 flex items-center justify-between text-xs font-semibold text-emerald-800 bg-emerald-100/60">
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
                            <div className="p-3 border-t border-emerald-200 text-xs text-slate-700 bg-white whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                                {task.aiSolution}
                            </div>
                        )}
                    </div>
                )}

                {/* AI Insights & Productivity Tips Panel */}
                {(task.aiPriorityReason || task.aiProductivityTips?.length > 0) && (
                    <div className="mt-3 bg-indigo-50/70 border border-indigo-200 rounded-xl overflow-hidden shadow-2xs">
                        <button
                            onClick={() => setExpandedAI(!expandedAI)}
                            className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-indigo-900 hover:bg-indigo-100/50 transition"
                        >
                            <div className="flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Claude AI Insights & Tips</span>
                            </div>
                            {expandedAI ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {expandedAI && (
                            <div className="p-3 border-t border-indigo-200 space-y-2.5 text-xs text-slate-700 bg-white">
                                {task.aiPriorityReason && (
                                    <div>
                                        <span className="font-semibold text-indigo-900 font-semibold">Priority Reason: </span>
                                        <span className="text-slate-600">{task.aiPriorityReason}</span>
                                    </div>
                                )}
                                {task.aiProductivityTips?.length > 0 && (
                                    <div>
                                        <span className="font-semibold text-indigo-900 font-semibold block mb-1">Productivity Tips:</span>
                                        <ul className="space-y-1 list-disc list-inside text-slate-600">
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
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
                        className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-900 font-semibold transition font-medium disabled:opacity-50"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                        <span>{analyzing ? 'Thinking...' : 'AI Tips'}</span>
                    </button>

                    <button
                        onClick={handleSolveTask}
                        disabled={solving}
                        className="flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition font-semibold shadow-2xs disabled:opacity-50"
                    >
                        <Zap className={`w-3.5 h-3.5 ${solving ? 'animate-spin' : ''}`} />
                        <span>{solving ? 'Executing...' : '⚡ Solve'}</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
