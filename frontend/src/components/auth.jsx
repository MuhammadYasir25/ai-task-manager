import React, { useState, useEffect } from 'react';
import API from '../api';
import { Sparkles, Lock, Mail, User, ArrowRight, KeyRound, CheckCircle2, RefreshCw, Clock, ArrowLeft } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
    // mode: 'login' | 'register' | 'verify-otp' | 'forgot' | 'reset'
    const [mode, setMode] = useState('login');
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
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP code.');
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
            <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/60">

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

                {/* ----- SCREEN 1: REGISTER OTP VERIFICATION ----- */}
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
                                <span className={timeLeft > 10 ? 'text-slate-700 font-medium' : 'text-rose-600 font-bold'}>
                                    {timeLeft > 0 ? `Code expires in 00:${timeLeft < 10 ? '0' : ''}${timeLeft}` : 'Code Expired'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    placeholder="• • • • • •"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-center text-2xl font-bold tracking-widest text-indigo-600 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otpCode.length !== 6 || timeLeft === 0}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 disabled:opacity-50"
                            >
                                <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await API.post('/auth/resend-otp', { email: verificationEmail });
                                        setTimeLeft(60);
                                        setSuccessMsg('New 60s code sent!');
                                    } catch (err) { setError('Failed to resend code'); }
                                }}
                                className="hover:text-indigo-600 flex items-center gap-1 text-indigo-600 font-semibold"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Resend Code</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="hover:text-slate-900 transition"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </div>
                )}

                {/* ----- SCREEN 2: FORGOT PASSWORD REQUEST ----- */}
                {mode === 'forgot' && (
                    <div>
                        <div className="text-center mb-5">
                            <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-3">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Forgot Password?</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Enter your registered email and we'll send you a 60-second verification code to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSendForgotOTP} className="space-y-4">
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
                                        value={verificationEmail}
                                        onChange={(e) => setVerificationEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm shadow-2xs"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !verificationEmail}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 disabled:opacity-50"
                            >
                                <span>{loading ? 'Sending Code...' : 'Send Reset Code'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition flex items-center justify-center gap-1 mx-auto"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Sign In</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ----- SCREEN 3: RESET PASSWORD WITH OTP ----- */}
                {mode === 'reset' && (
                    <div>
                        <div className="text-center mb-5">
                            <h2 className="text-lg font-bold text-slate-900">Reset Your Password</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Enter the 6-digit code sent to <strong className="text-indigo-600">{verificationEmail}</strong>
                            </p>
                            <div className="mt-2 inline-flex items-center space-x-1.5 px-3.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                                <Clock className={`w-3.5 h-3.5 ${timeLeft > 10 ? 'text-indigo-600' : 'text-rose-500 animate-pulse'}`} />
                                <span className={timeLeft > 10 ? 'text-slate-700 font-medium' : 'text-rose-600 font-bold'}>
                                    {timeLeft > 0 ? `Code expires in 00:${timeLeft < 10 ? '0' : ''}${timeLeft}` : 'Code Expired'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">6-Digit OTP Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    placeholder="• • • • • •"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-center text-xl font-bold tracking-widest text-indigo-600 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-indigo-500 shadow-2xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Min. 8 chars (Test@123)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Re-type new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-indigo-500"
                                />
                            </div>

                            {/* Password Criteria */}
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[10px]">
                                <p className="font-semibold text-slate-600">Requirements:</p>
                                <div className="grid grid-cols-2 gap-1">
                                    <span className={passwordChecks.length ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>8+ Characters</span>
                                    <span className={passwordChecks.upper ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>Uppercase (A-Z)</span>
                                    <span className={passwordChecks.lower ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>Lowercase (a-z)</span>
                                    <span className={passwordChecks.number ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>Number (0-9)</span>
                                    <span className={passwordChecks.special ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>Special (@$!%)</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !isPasswordValid || otpCode.length !== 6 || timeLeft === 0}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md disabled:opacity-50"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password & Login'}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="text-xs text-slate-500 hover:text-slate-900"
                            >
                                Cancel & Back to Sign In
                            </button>
                        </div>
                    </div>
                )}

                {/* ----- SCREEN 4: LOGIN & REGISTER ----- */}
                {(mode === 'login' || mode === 'register') && (
                    <div>
                        <p className="text-sm text-slate-500 text-center mb-6">
                            {mode === 'login'
                                ? 'Sign in to access your AI-powered tasks'
                                : 'Create an account to boost your productivity with Claude'}
                        </p>

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
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition"
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
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 disabled:opacity-50"
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
                                className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition"
                            >
                                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
