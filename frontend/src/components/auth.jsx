import React, { useState, useEffect } from 'react';
import API from '../api';
import { Sparkles, Lock, Mail, User, ArrowRight, KeyRound, CheckCircle2, RefreshCw, Clock, ArrowLeft, X } from 'lucide-react';

export default function Auth({ onLoginSuccess, initialMode = 'login', onClose, isModal = false }) {
    // mode: 'login' | 'register' | 'verify-otp' | 'forgot' | 'reset'
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    // OTP & Reset state
    const [verificationEmail, setVerificationEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 60-Second Countdown
    const [timeLeft, setTimeLeft] = useState(60);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    useEffect(() => {
        let timer;
        if ((mode === 'verify-otp' || mode === 'reset') && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [mode, timeLeft]);

    const passwordToCheck = mode === 'reset' ? newPassword : formData.password;
    const passwordChecks = {
        length: passwordToCheck.length >= 8,
        upper: /[A-Z]/.test(passwordToCheck),
        lower: /[a-z]/.test(passwordToCheck),
        number: /[0-9]/.test(passwordToCheck),
        special: /[@$!%*?&#^_\-]/.test(passwordToCheck),
    };
    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
            const payload = mode === 'login'
                ? { email: formData.email, password: formData.password }
                : formData;

            const { data } = await API.post(endpoint, payload);

            if (data.requireVerification) {
                setVerificationEmail(data.email);
                setMode('verify-otp');
                setTimeLeft(60);
                setSuccessMsg(data.message || 'Verification code sent (valid for 60 seconds).');
            } else {
                localStorage.setItem('user', JSON.stringify(data));
                onLoginSuccess(data);
                if (onClose) onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (timeLeft <= 0) {
            setError('Verification code has expired! Please click Resend Code.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const { data } = await API.post('/auth/verify-otp', {
                email: verificationEmail,
                otp: otpCode.trim(),
            });

            localStorage.setItem('user', JSON.stringify(data));
            onLoginSuccess(data);
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setTimeLeft(60);
        setLoading(true);

        try {
            const { data } = await API.post('/auth/resend-otp', { email: verificationEmail });
            setSuccessMsg(data.message || 'New verification code sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification code.');
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password - Send OTP
    const handleSendForgotOTP = async (e) => {
        e.preventDefault();
        setError('');
        setTimeLeft(60);
        setLoading(true);

        try {
            const { data } = await API.post('/auth/forgot-password', { email: verificationEmail });
            setSuccessMsg(data.message || 'Reset code sent to your Gmail!');
            setMode('reset');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    // Reset Password - Confirm OTP & New Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!isPasswordValid) {
            setError('Please meet all strong password criteria');
            return;
        }

        setLoading(true);
        try {
            const { data } = await API.post('/auth/reset-password', {
                email: verificationEmail,
                otp: otpCode.trim(),
                newPassword,
            });
            setSuccessMsg(data.message || 'Password reset successfully! Please sign in.');
            setMode('login');
            setFormData({ ...formData, password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const cardContent = (
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/60 relative animate-in zoom-in-95 duration-150">
            {isModal && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Logo */}
            <div className="flex items-center justify-center space-x-2.5 mb-6">
                <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Task Manager</h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs text-center font-medium">
                    {successMsg}
                </div>
            )}

            {/* SCREEN 1: REGISTER OTP VERIFICATION */}
            {mode === 'verify-otp' && (
                <div>
                    <div className="text-center mb-5">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-3">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Enter Verification Code</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            We sent a 6-digit code to <br />
                            <strong className="text-indigo-600">{verificationEmail}</strong>
                        </p>
                        <div className="mt-3 inline-flex items-center space-x-1.5 px-3.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                            <Clock className={`w-3.5 h-3.5 ${timeLeft > 10 ? 'text-indigo-600' : 'text-rose-500 animate-pulse'}`} />
                            <span className={timeLeft > 10 ? 'text-slate-700 font-semibold' : 'text-rose-600 font-bold'}>
                                Code expires in: {timeLeft}s
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="• • • • • •"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading || otpCode.length !== 6 || timeLeft <= 0}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 cursor-pointer"
                        >
                            <span>{loading ? 'Verifying...' : 'Confirm & Log In'}</span>
                            <CheckCircle2 className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-5 text-center flex items-center justify-center space-x-4 text-xs">
                        <button
                            onClick={handleResendOTP}
                            disabled={loading || timeLeft > 0}
                            className="text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 font-semibold transition flex items-center space-x-1 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Resend Code</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                            onClick={() => { setMode('login'); setError(''); }}
                            className="text-slate-500 hover:text-slate-700 transition"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </div>
            )}

            {/* SCREEN 2: FORGOT PASSWORD */}
            {mode === 'forgot' && (
                <div>
                    <div className="text-center mb-5">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-3">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Reset Your Password</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter your registered email. We will send a 60-second OTP code to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSendForgotOTP} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Registered Email
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={verificationEmail}
                                    onChange={(e) => setVerificationEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !verificationEmail}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
                        >
                            <span>{loading ? 'Sending Code...' : 'Send Reset Code'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <button
                            onClick={() => { setMode('login'); setError(''); }}
                            className="text-xs text-slate-500 hover:text-indigo-600 flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Return to Login</span>
                        </button>
                    </div>
                </div>
            )}

            {/* SCREEN 3: RESET PASSWORD CONFIRMATION */}
            {mode === 'reset' && (
                <div>
                    <div className="text-center mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Set New Password</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter the 6-digit code sent to <strong className="text-indigo-600">{verificationEmail}</strong>
                        </p>
                        <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                            <Clock className={`w-3.5 h-3.5 ${timeLeft > 10 ? 'text-indigo-600' : 'text-rose-500 animate-pulse'}`} />
                            <span className={timeLeft > 10 ? 'text-slate-700 font-semibold' : 'text-rose-600 font-bold'}>
                                Code expires in: {timeLeft}s
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                6-Digit OTP Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="• • • • • •"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center tracking-[0.4em] text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition shadow-2xs"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Min. 8 chars (Aa1@)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                />
                            </div>
                        </div>

                        {newPassword.length > 0 && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                                <div className="grid grid-cols-2 gap-1.5">
                                    <span className={passwordChecks.length ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.length ? '✓' : '•'} 8+ Characters
                                    </span>
                                    <span className={passwordChecks.upper ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.upper ? '✓' : '•'} Uppercase (A-Z)
                                    </span>
                                    <span className={passwordChecks.lower ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.lower ? '✓' : '•'} Lowercase (a-z)
                                    </span>
                                    <span className={passwordChecks.number ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.number ? '✓' : '•'} Number (0-9)
                                    </span>
                                    <span className={passwordChecks.special ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.special ? '✓' : '•'} Special (@#$...)
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid || newPassword !== confirmPassword || timeLeft <= 0}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
                        >
                            <span>{loading ? 'Updating Password...' : 'Save New Password & Login'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* SCREEN 4: LOGIN & REGISTER */}
            {(mode === 'login' || mode === 'register') && (
                <div>
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                                mode === 'login'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('register'); setError(''); }}
                            className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                                mode === 'register'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Create Account
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Muhammad Yasir"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                {mode === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVerificationEmail(formData.email);
                                            setError('');
                                            setMode('forgot');
                                        }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition cursor-pointer"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Min. 8 chars (Aa1@)"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                />
                            </div>
                        </div>

                        {mode === 'register' && formData.password.length > 0 && (
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                                <p className="font-semibold text-slate-600 mb-1">Password Requirements:</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <span className={passwordChecks.length ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.length ? '✓' : '•'} 8+ Characters
                                    </span>
                                    <span className={passwordChecks.upper ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.upper ? '✓' : '•'} Uppercase (A-Z)
                                    </span>
                                    <span className={passwordChecks.lower ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.lower ? '✓' : '•'} Lowercase (a-z)
                                    </span>
                                    <span className={passwordChecks.number ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.number ? '✓' : '•'} Number (0-9)
                                    </span>
                                    <span className={passwordChecks.special ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                                        {passwordChecks.special ? '✓' : '•'} Special (@$!%*?&#)
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (mode === 'register' && !isPasswordValid)}
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                            <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create & Verify Account'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login');
                                setError('');
                            }}
                            className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition cursor-pointer"
                        >
                            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                {cardContent}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
            {cardContent}
        </div>
    );
}
