import React, { useState, useEffect } from 'react';
import API from '../api';
import { Sparkles, Lock, Mail, User, ArrowRight, KeyRound, CheckCircle2, RefreshCw, Clock } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    // OTP Verification state
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');

    // 60-Second Countdown Timer
    const [timeLeft, setTimeLeft] = useState(60);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Timer countdown hook
    useEffect(() => {
        let timer;
        if (awaitingVerification && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [awaitingVerification, timeLeft]);

    // Password validation checks
    const passwordChecks = {
        length: formData.password.length >= 8,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[@$!%*?&#^_\-]/.test(formData.password),
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const { data } = await API.post(endpoint, payload);

            if (data.requireVerification) {
                setVerificationEmail(data.email);
                setAwaitingVerification(true);
                setTimeLeft(60); // Reset timer to 60 seconds
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
        setSuccessMsg('');
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

    const handleResendOTP = async () => {
        try {
            setError('');
            const { data } = await API.post('/auth/resend-otp', { email: verificationEmail });
            setTimeLeft(60); // Reset 60s timer
            setOtpCode('');
            setSuccessMsg(data.message || 'New 60-second code sent!');
        } catch (err) {
            setError('Failed to resend code');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

                {/* Logo */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">AI Task Manager</h1>
                </div>

                {/* SCREEN 1: OTP Verification Screen with 60s Countdown */}
                {awaitingVerification ? (
                    <div>
                        <div className="text-center mb-5">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 mb-3">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Enter Verification Code</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                We sent a 6-digit code to <br />
                                <strong className="text-indigo-400">{verificationEmail}</strong>
                            </p>

                            {/* 60s Live Countdown Timer */}
                            <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs">
                                <Clock className={`w-3.5 h-3.5 ${timeLeft > 10 ? 'text-indigo-400' : 'text-rose-400 animate-pulse'}`} />
                                <span className={timeLeft > 10 ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                                    {timeLeft > 0 ? `Code expires in 00:${timeLeft < 10 ? '0' : ''}${timeLeft}` : 'Code Expired'}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center">
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs text-center">
                                {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    placeholder="• • • • • •"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-2xl font-bold tracking-widest text-indigo-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otpCode.length !== 6 || timeLeft === 0}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                            >
                                <span>{loading ? 'Verifying...' : timeLeft === 0 ? 'Code Expired' : 'Verify & Continue'}</span>
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="hover:text-indigo-400 flex items-center gap-1 transition text-indigo-400 font-medium"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Resend Code (60s)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAwaitingVerification(false)}
                                className="hover:text-white transition"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </div>
                ) : (
                    /* SCREEN 2: Register / Login Screen */
                    <div>
                        <p className="text-sm text-slate-400 text-center mb-6">
                            {isLogin ? 'Sign in to access your AI-powered tasks' : 'Create an account to boost your productivity with Claude'}
                        </p>

                        {error && (
                            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Muhammad Yasir"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Min. 8 chars (Aa1@)"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password Requirement Guidelines (Shown during Sign Up) */}
                            {!isLogin && formData.password.length > 0 && (
                                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1 text-[11px]">
                                    <p className="font-semibold text-slate-400 mb-1">Password Requirements:</p>
                                    <div className="grid grid-cols-2 gap-1">
                                        <span className={passwordChecks.length ? 'text-emerald-400' : 'text-slate-500'}>
                                            {passwordChecks.length ? '✓' : '○'} 8+ Characters
                                        </span>
                                        <span className={passwordChecks.upper ? 'text-emerald-400' : 'text-slate-500'}>
                                            {passwordChecks.upper ? '✓' : '○'} Uppercase (A-Z)
                                        </span>
                                        <span className={passwordChecks.lower ? 'text-emerald-400' : 'text-slate-500'}>
                                            {passwordChecks.lower ? '✓' : '○'} Lowercase (a-z)
                                        </span>
                                        <span className={passwordChecks.number ? 'text-emerald-400' : 'text-slate-500'}>
                                            {passwordChecks.number ? '✓' : '○'} Number (0-9)
                                        </span>
                                        <span className={passwordChecks.special ? 'text-emerald-400' : 'text-slate-500'}>
                                            {passwordChecks.special ? '✓' : '○'} Special (@$!%*?&#)
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (!isLogin && !isPasswordValid)}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                            >
                                <span>{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create & Verify Account'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                                className="text-sm text-slate-400 hover:text-indigo-400 transition"
                            >
                                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
