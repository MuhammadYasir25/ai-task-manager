import React, { useState, useEffect } from 'react';
import { 
    X, User, Mail, Shield, Lock, CheckCircle2, LogOut, 
    AlertCircle, KeyRound, Sun, Moon, Bell, Eye, EyeOff, Sparkles
} from 'lucide-react';
import API from '../api';

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Theme & Preferences State
    const [selectedTheme, setSelectedTheme] = useState(() => {
        return localStorage.getItem('app_theme') || 'light';
    });
    const [emailAlerts, setEmailAlerts] = useState(() => {
        return localStorage.getItem('pref_email_alerts') !== 'false';
    });
    const [taskReminders, setTaskReminders] = useState(() => {
        return localStorage.getItem('pref_task_reminders') !== 'false';
    });

    useEffect(() => {
        if (selectedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('app_theme', selectedTheme);
    }, [selectedTheme]);

    if (!isOpen) return null;

    const passwordChecks = {
        length: passwordForm.newPassword.length >= 8,
        upper: /[A-Z]/.test(passwordForm.newPassword),
        lower: /[a-z]/.test(passwordForm.newPassword),
        number: /[0-9]/.test(passwordForm.newPassword),
        special: /[@$!%*?&#^_\-]/.test(passwordForm.newPassword),
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (!isPasswordValid) {
            setError('Please satisfy all strong password criteria below');
            return;
        }

        setLoading(true);
        try {
            const { data } = await API.put('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setSuccess(data.message || 'Password updated successfully!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = (themeMode) => {
        setSelectedTheme(themeMode);
    };

    const toggleEmailAlerts = () => {
        const next = !emailAlerts;
        setEmailAlerts(next);
        localStorage.setItem('pref_email_alerts', String(next));
    };

    const toggleTaskReminders = () => {
        const next = !taskReminders;
        setTaskReminders(next);
        localStorage.setItem('pref_task_reminders', String(next));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div 
                className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-indigo-600/25">
                            {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-slate-900 leading-tight">{user?.name || 'Account'}</h2>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    {user?.role || 'user'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Bar / Tabs */}
                <div className="px-6 pt-4 pb-1 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
                            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                                activeTab === 'profile'
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>My Profile</span>
                        </button>

                        <button
                            onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
                            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                                activeTab === 'password'
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                        >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Change Password</span>
                        </button>

                        <button
                            onClick={() => { setActiveTab('theme'); setError(''); setSuccess(''); }}
                            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                                activeTab === 'theme'
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                        >
                            <Sun className="w-3.5 h-3.5" />
                            <span>Theme & Settings</span>
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {error && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                            <span className="font-medium">{success}</span>
                        </div>
                    )}

                    {/* TAB 1: Profile View */}
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3.5">
                                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                                    <span className="text-slate-500 font-medium">Account Status</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        Verified Account
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                                    <span className="text-slate-500 font-medium">Full Name</span>
                                    <span className="font-semibold text-slate-800">{user?.name}</span>
                                </div>

                                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                                    <span className="text-slate-500 font-medium">Email Address</span>
                                    <span className="font-semibold text-slate-800">{user?.email}</span>
                                </div>

                                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                                    <span className="text-slate-500 font-medium">Access Role</span>
                                    <span className="capitalize font-semibold text-indigo-600">{user?.role || 'User'}</span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">AI Engine</span>
                                    <span className="inline-flex items-center gap-1 font-semibold text-violet-600">
                                        <Sparkles className="w-3.5 h-3.5" /> Active (Anthropic Claude 3.5)
                                    </span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-start gap-3">
                                <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">
                                    Your account is fully secured with password encryption, JWT authentication, and 60-second OTP email verification.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Change Password */}
                    {activeTab === 'password' && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        required
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        placeholder="Enter your current password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    New Strong Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        placeholder="Enter your new password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements Checklist */}
                            {passwordForm.newPassword.length > 0 && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                                    <p className="font-bold text-slate-700">Password Checklist:</p>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <span className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.length ? 'text-emerald-600' : 'text-slate-300'}`} />
                                            8+ characters
                                        </span>
                                        <span className={`flex items-center gap-1.5 ${passwordChecks.upper ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.upper ? 'text-emerald-600' : 'text-slate-300'}`} />
                                            Uppercase (A-Z)
                                        </span>
                                        <span className={`flex items-center gap-1.5 ${passwordChecks.lower ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.lower ? 'text-emerald-600' : 'text-slate-300'}`} />
                                            Lowercase (a-z)
                                        </span>
                                        <span className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.number ? 'text-emerald-600' : 'text-slate-300'}`} />
                                            Number (0-9)
                                        </span>
                                        <span className={`flex items-center gap-1.5 ${passwordChecks.special ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.special ? 'text-emerald-600' : 'text-slate-300'}`} />
                                            Special character (@#$...)
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        required
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        placeholder="Re-enter your new password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !isPasswordValid}
                                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Updating Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>Update Password</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* TAB 3: Theme & Preferences */}
                    {activeTab === 'theme' && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-2.5">
                                    Interface Appearance Theme
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleThemeChange('light')}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                                            selectedTheme === 'light'
                                                ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-900'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl ${selectedTheme === 'light' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            <Sun className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Light Theme</p>
                                            <p className="text-[11px] text-slate-500">Clean & bright styling</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleThemeChange('dark')}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                                            selectedTheme === 'dark'
                                                ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-900'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl ${selectedTheme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            <Moon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Dark Theme</p>
                                            <p className="text-[11px] text-slate-500">Low-light night mode</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <p className="text-xs font-bold text-slate-800">Notification Preferences</p>

                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">Email Notifications</p>
                                            <p className="text-[11px] text-slate-500">Receive task completion & OTP updates</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleEmailAlerts}
                                        className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer ${
                                            emailAlerts ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                                        }`}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">Task Reminders</p>
                                            <p className="text-[11px] text-slate-500">Alerts when urgent tasks are pending</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleTaskReminders}
                                        className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer ${
                                            taskReminders ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                                        }`}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Sign Out Button */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onLogout();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition shadow-2xs"
                    >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Log Out of Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
