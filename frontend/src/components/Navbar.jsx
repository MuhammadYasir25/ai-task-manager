import React, { useState } from 'react';
import { Sparkles, Plus, CheckCircle2, Shield, Menu, User } from 'lucide-react';
import ProfileModal from './ProfileModal.jsx';

export default function Navbar({ 
    user, 
    onLogout, 
    onOpenModal, 
    taskStats, 
    onViewAdmin, 
    showAdminView
}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="border-b border-slate-200/90 bg-white sticky top-0 z-40 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Left: Brand Logo & Title */}
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">AI Task Manager</h1>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">Powered by Anthropic Claude 3.5</p>
                    </div>
                </div>

                {/* Middle: Quick Stats Badges (Visible on md+) */}
                <div className="hidden md:flex items-center space-x-3 text-xs">
                    <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200/80 rounded-full text-indigo-900 font-semibold shadow-2xs">
                        Total Tasks: <strong className="text-indigo-700 font-bold ml-1">{taskStats?.total || 0}</strong>
                    </span>
                    <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-900 flex items-center gap-1.5 font-semibold shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completed: <strong className="text-emerald-700 font-bold ml-0.5">{taskStats?.completed || 0}</strong>
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-3">
                    {/* Admin Toggle (Only for logged-in admin) */}
                    {user?.role === 'admin' && (
                        <button
                            onClick={onViewAdmin}
                            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition hover:scale-105 active:scale-95 cursor-pointer ${
                                showAdminView
                                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-2xs'
                            }`}
                        >
                            <Shield className="w-3.5 h-3.5 text-amber-600" />
                            <span>{showAdminView ? 'Exit Admin' : 'Admin Portal'}</span>
                        </button>
                    )}

                    {/* New Task Button */}
                    {!showAdminView && (
                        <button
                            onClick={onOpenModal}
                            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm hover:shadow-md shadow-indigo-600/25 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">New Task</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-slate-200" />

                    {/* 3-Bar Profile & Settings Button (Includes Logout inside) */}
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center space-x-2.5 p-1.5 pl-2 pr-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition border border-slate-200/90 hover:border-slate-300 shadow-2xs cursor-pointer group"
                        title="Profile, Settings, Theme & Change Password"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                            {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition">{user?.name}</p>
                            <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">{user?.role || 'user'}</span>
                        </div>
                        <div className="p-1 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-300 text-slate-600 group-hover:text-indigo-600 transition">
                            <Menu className="w-4 h-4" />
                        </div>
                    </button>
                </div>

            </div>

            {/* Profile & Settings Drawer */}
            <ProfileModal 
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                onLogout={onLogout}
            />

        </header>
    );
}
