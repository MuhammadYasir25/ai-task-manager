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
    Urgent: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    High: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    Medium: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
    Low: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
};

const statusColors = {
    pending: 'text-amber-800 border-amber-300 bg-amber-50',
    'in-progress': 'text-blue-800 border-blue-300 bg-blue-50',
    completed: 'text-emerald-800 border-emerald-300 bg-emerald-50',
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

    const handleDelete = () => {
        onDeleteTask(task._id);
    };

    const handleCopy = () => {
        if (task.aiSolution) {
            navigator.clipboard.writeText(task.aiSolution);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">

            <div>
                {/* Priority & Status Controls */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] px-3 py-1 rounded-full border shadow-2xs ${priorityColors[task.priority] || priorityColors.Medium}`}>
                        {task.priority} Priority
                    </span>

                    <div className="flex items-center space-x-2">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`text-xs font-semibold rounded-xl px-2.5 py-1 border focus:outline-none transition cursor-pointer shadow-2xs ${statusColors[task.status] || statusColors.pending}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button
                            onClick={handleDelete}
                            title="Delete Task"
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className={`text-base font-bold text-slate-900 mb-1.5 transition leading-snug ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                </h3>
                {task.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {task.description}
                    </p>
                )}

                {/* Subtasks Section */}
                {totalSubtasks > 0 && (
                    <div className="mb-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">
                                Subtasks ({completedSubtasks}/{totalSubtasks})
                            </span>
                            <span className="font-bold text-indigo-600">{progressPercent}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        {/* Subtasks List */}
                        <div className="space-y-1.5 pt-1">
                            {task.subtasks.map((sub) => (
                                <button
                                    key={sub._id}
                                    type="button"
                                    onClick={() => handleToggleSubtask(sub._id)}
                                    className="w-full flex items-start gap-2.5 text-left text-xs p-1.5 rounded-lg hover:bg-white transition cursor-pointer group/sub"
                                >
                                    <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                                        sub.completed 
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs' 
                                            : 'border-slate-300 bg-white group-hover/sub:border-indigo-500'
                                    }`}>
                                        {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className={`leading-tight transition ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                        {sub.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Solution Result (Full Automated Execution) */}
                {task.aiSolution && (
                    <div className="mb-4 bg-gradient-to-br from-emerald-50/90 to-teal-50/90 border border-emerald-200 rounded-2xl p-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span>AI Execution Result</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleCopy}
                                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition flex items-center gap-1 cursor-pointer"
                                >
                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                                <button
                                    onClick={() => setExpandedSolution(!expandedSolution)}
                                    className="text-emerald-600 hover:text-emerald-800 p-0.5"
                                >
                                    {expandedSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {expandedSolution && (
                            <div className="mt-2.5 pt-2 border-t border-emerald-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto font-sans pr-1">
                                {task.aiSolution}
                            </div>
                        )}
                    </div>
                )}

                {/* AI Reasoning / Advice Box */}
                {task.aiReasoning && (
                    <div className="mb-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3">
                        <button
                            onClick={() => setExpandedAI(!expandedAI)}
                            className="w-full flex items-center justify-between text-xs font-bold text-indigo-900 cursor-pointer"
                        >
                            <span className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                                Claude AI Insights
                            </span>
                            {expandedAI ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedAI && (
                            <div className="mt-2 pt-2 border-t border-indigo-200/60 text-xs text-indigo-950 leading-relaxed whitespace-pre-line">
                                {task.aiReasoning}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center text-[11px] text-slate-400 gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Decompose with AI */}
                    <button
                        type="button"
                        onClick={handleTriggerAI}
                        disabled={analyzing}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold rounded-xl transition cursor-pointer hover:scale-105 active:scale-95"
                        title="Generate subtasks with Claude AI"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin text-indigo-600' : ''}`} />
                        <span>{analyzing ? 'Thinking...' : 'AI Subtasks'}</span>
                    </button>

                    {/* Solve / Execute with AI */}
                    <button
                        type="button"
                        onClick={handleSolveTask}
                        disabled={solving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition cursor-pointer hover:scale-105 active:scale-95"
                        title="Execute and generate full solution with Claude AI"
                    >
                        <Zap className={`w-3.5 h-3.5 ${solving ? 'animate-pulse' : ''}`} />
                        <span>{solving ? 'Executing...' : 'AI Execute'}</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
