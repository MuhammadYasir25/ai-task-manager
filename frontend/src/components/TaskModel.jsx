import React, { useState } from 'react';
import { X, Sparkles, Calendar, AlertCircle } from 'lucide-react';
import API from '../api';

export default function TaskModal({ isOpen, onClose, onTaskCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        autoAnalyze: true, // Default to true to showcase the AI!
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await API.post('/tasks', formData);
            onTaskCreated(data);
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                dueDate: '',
                autoAnalyze: true,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Create New Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Task Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Build JWT Authentication module for web app"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Description (Optional)</label>
                        <textarea
                            rows={3}
                            placeholder="Provide context or constraints to help Claude break this down into actionable steps..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Initial Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Auto-Breakdown Toggle */}
                    <div className="p-4 bg-gradient-to-r from-indigo-950/40 to-violet-950/40 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-white">Auto-Analyze with Claude AI</p>
                                <p className="text-xs text-slate-400">Generates subtasks, priority reasoning, and productivity tips</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.autoAnalyze}
                                onChange={(e) => setFormData({ ...formData, autoAnalyze: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center space-x-2 disabled:opacity-50"
                        >
                            {loading && <Sparkles className="w-4 h-4 animate-spin" />}
                            <span>{loading ? 'Analyzing with Claude...' : 'Create Task'}</span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
