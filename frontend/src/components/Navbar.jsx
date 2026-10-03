import React from 'react';
import { Sparkles, Plus, LogOut, CheckCircle2, Shield } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenModal, taskStats, onViewAdmin, showAdminView }) {
    return (
        <header className="border-b border-slate-200/90 bg-white/85 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">AI Task Manager</h1>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">Powered by Claude</p>
                    </div>
                </div>

                {/* Quick Stats Badges */}
                <div className="hidden md:flex items-center space-x-3 text-xs">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-medium">
                        Total: <strong className="text-slate-900 font-bold">{taskStats.total}</strong>
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed: <strong className="text-emerald-800 font-bold">{taskStats.completed}</strong>
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-3">
                    {/* Admin Toggle Button */}
                    {user?.role === 'admin' && (
                        <button
                            onClick={onViewAdmin}
                            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition ${showAdminView
                                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-2xs'
                                }`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>{showAdminView ? 'Exit Admin' : 'Admin Portal'}</span>
                        </button>
                    )}

                    {!showAdminView && (
                        <button
                            onClick={onOpenModal}
                            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm hover:shadow-md shadow-indigo-600/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Task</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-slate-200" />

                    <div className="flex items-center space-x-2">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                            <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">{user?.role || 'user'}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            title="Sign Out"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </header>
    );
}
