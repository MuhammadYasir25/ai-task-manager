import React from 'react';
import { Sparkles, Plus, LogOut, CheckCircle2, Shield } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenModal, taskStats, onViewAdmin, showAdminView }) {
    return (
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight leading-none">AI Task Manager</h1>
                        <p className="text-xs text-indigo-400 font-medium">Powered by Claude</p>
                    </div>
                </div>

                {/* Quick Stats Badges */}
                <div className="hidden md:flex items-center space-x-3 text-xs">
                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
                        Total: <strong className="text-white">{taskStats.total}</strong>
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed: <strong className="text-emerald-300">{taskStats.completed}</strong>
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-3">
                    {/* Admin Toggle Button */}
                    {user?.role === 'admin' && (
                        <button
                            onClick={onViewAdmin}
                            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition ${showAdminView
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                }`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>{showAdminView ? 'Exit Admin' : 'Admin Portal'}</span>
                        </button>
                    )}

                    {!showAdminView && (
                        <button
                            onClick={onOpenModal}
                            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Task</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-slate-800" />

                    <div className="flex items-center space-x-2">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-medium text-white">{user?.name}</p>
                            <span className="text-[10px] text-indigo-400 capitalize">{user?.role || 'user'}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            title="Sign Out"
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </header>
    );
}
