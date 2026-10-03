import React, { useState, useRef, useEffect } from 'react';
import { 
    Sparkles, Shield, Zap, Lock, ArrowRight, CheckCircle2, Check, UserPlus, 
    LogIn, ChevronDown, Layers, Calendar, Bot, MessageSquare, FileText, 
    Kanban, Headphones, Mail, HelpCircle, Send, X, ExternalLink, Activity, Flame
} from 'lucide-react';

export default function LandingPage({ onOpenAuth }) {
    // Dropdown & Modal States
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [pricingOpen, setPricingOpen] = useState(false);

    // Support Form State
    const [supportForm, setSupportForm] = useState({ name: '', email: '', category: 'general', message: '' });
    const [supportSubmitted, setSupportSubmitted] = useState(false);

    const megaMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
                setFeaturesOpen(false);
                setResourcesOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSupportSubmit = (e) => {
        e.preventDefault();
        setSupportSubmitted(true);
        setTimeout(() => {
            setSupportSubmitted(false);
            setSupportOpen(false);
            setSupportForm({ name: '', email: '', category: 'general', message: '' });
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
            
            {/* ========================================================= */}
            {/* 1. COMPREHENSIVE SAAS NAVIGATION BAR WITH MEGA MENU       */}
            {/* ========================================================= */}
            <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs" ref={megaMenuRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    
                    {/* Left: Brand Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">AI Task Manager</h1>
                            <p className="text-xs text-indigo-600 font-medium mt-0.5">Powered by Anthropic Claude 3.5</p>
                        </div>
                    </div>

                    {/* Middle: Desktop Navigation Items */}
                    <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold text-slate-700">
                        
                        {/* Features Mega Menu Trigger */}
                        <div className="relative">
                            <button
                                onClick={() => { setFeaturesOpen(!featuresOpen); setResourcesOpen(false); }}
                                onMouseEnter={() => { setFeaturesOpen(true); setResourcesOpen(false); }}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                                    featuresOpen ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <span>Features</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${featuresOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                            </button>

                            {/* MEGA MENU DROPDOWN PANEL (Matching Image 1.1) */}
                            {featuresOpen && (
                                <div 
                                    onMouseLeave={() => setFeaturesOpen(false)}
                                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-[820px] bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-slate-900/10 grid grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-150 z-50"
                                >
                                    {/* Col 1: Project Management */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Project Management
                                        </p>
                                        
                                        <div 
                                            onClick={() => onOpenAuth('register')} 
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">AI Task Manager</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Organize, decompose & prioritize tasks</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                                <Kanban className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">AI Gantt & Flow</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Visual timelines with auto-scheduling</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">AI Workflows</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Automate repeatable execution SOPs</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 2: Time Management */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Time Management
                                        </p>
                                        
                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">AI Smart Calendar</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Auto-plan day around priority tasks</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">Focus & Streak Mode</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Stay accountable with score tracking</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition">
                                                <Flame className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Urgent Task Alert</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">High priority immediate notifications</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 3: Knowledge & AI Execution */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Knowledge & AI
                                        </p>
                                        
                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">Claude 3.5 Copilot</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Autonomous goal breakdown engine</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition">Solution Generator</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Instant code & document blueprints</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => onOpenAuth('register')}
                                            className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg group-hover:bg-cyan-600 group-hover:text-white transition">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition">Private Vault</h4>
                                                <p className="text-[11px] text-slate-500 leading-snug">Zero leakage private cloud storage</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 4: Integrations & More */}
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                Ecosystem
                                            </span>
                                            <h4 className="text-xs font-bold text-slate-900 mt-2">Connected Tech Stack</h4>
                                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                                Seamlessly built on React, Tailwind, Express.js, MongoDB Atlas & Anthropic Claude 3.5.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => onOpenAuth('register')}
                                            className="w-full mt-4 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>Explore Platform</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Resources Dropdown Trigger */}
                        <div className="relative">
                            <button
                                onClick={() => { setResourcesOpen(!resourcesOpen); setFeaturesOpen(false); }}
                                onMouseEnter={() => { setResourcesOpen(true); setFeaturesOpen(false); }}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                                    resourcesOpen ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <span>Resources</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                            </button>

                            {/* RESOURCES DROPDOWN MENU */}
                            {resourcesOpen && (
                                <div 
                                    onMouseLeave={() => setResourcesOpen(false)}
                                    className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50"
                                >
                                    <div 
                                        onClick={() => onOpenAuth('register')}
                                        className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        <h4 className="text-xs font-bold text-slate-900">Documentation & API</h4>
                                        <p className="text-[11px] text-slate-500">Guides for task schemas & Claude endpoints</p>
                                    </div>
                                    <div 
                                        onClick={() => onOpenAuth('register')}
                                        className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        <h4 className="text-xs font-bold text-slate-900">Security Architecture</h4>
                                        <p className="text-[11px] text-slate-500">60-second OTP & JWT authentication details</p>
                                    </div>
                                    <div 
                                        onClick={() => onOpenAuth('register')}
                                        className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        <h4 className="text-xs font-bold text-slate-900">Changelog & Updates</h4>
                                        <p className="text-[11px] text-slate-500">Latest Claude 3.5 integrations & fixes</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pricing Button */}
                        <button
                            onClick={() => setPricingOpen(true)}
                            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                        >
                            Pricing
                        </button>

                        {/* Contact & Support Button (Requested explicitly) */}
                        <button
                            onClick={() => setSupportOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-indigo-600 bg-indigo-50/60 hover:bg-indigo-100 transition cursor-pointer"
                        >
                            <Headphones className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Contact & Support</span>
                        </button>

                    </nav>

                    {/* Right Actions: Login & Try Free / Get Started */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onOpenAuth('login')}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Login</span>
                        </button>

                        <button
                            onClick={() => onOpenAuth('register')}
                            className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Try AI Manager for Free</span>
                        </button>
                    </div>

                </div>
            </header>

            {/* ========================================================= */}
            {/* 2. HERO SECTION & SAAS SHOWCASE                           */}
            {/* ========================================================= */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center text-center">
                
                {/* AI Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Next-Gen Task Management & AI Execution</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight sm:leading-tight">
                    Supercharge Your Productivity with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Claude 3.5 AI</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                    Organize your personal tasks in a private, encrypted workspace. Decompose complex projects into atomic subtasks and execute solutions automatically with intelligent AI.
                </p>

                {/* Action CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
                    <button
                        onClick={() => onOpenAuth('register')}
                        className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Try AI Manager Free</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onOpenAuth('login')}
                        className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                        Sign In to Your Workspace
                    </button>
                </div>

                {/* Professional Showcase Illustration */}
                <div className="mt-14 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 p-2 sm:p-3 relative group">
                    <img
                        src="/ai-banner.jpg"
                        alt="AI Task Manager Dashboard Showcase"
                        className="w-full h-auto max-h-[500px] object-cover rounded-2xl opacity-95 group-hover:scale-[1.01] transition-transform duration-500"
                    />
                </div>

                {/* 3 Core Value Pillars */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">100% Private Workspace</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Your tasks are strictly private to your authenticated account. Only you can view, edit, or manage your personal tasks.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Claude 3.5 AI Decomposition</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Input any high-level objective and let Claude break it down into sequential, actionable steps with automatic solution generation.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">60s OTP & JWT Security</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Enterprise-grade bcrypt password hashing, 60-second OTP email verification, and tokenized session authentication.
                        </p>
                    </div>
                </div>

            </main>

            {/* ========================================================= */}
            {/* 3. CONTACT & 24/7 SUPPORT MODAL                           */}
            {/* ========================================================= */}
            {supportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSupportOpen(false)}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Contact & Support</h3>
                                <p className="text-xs text-slate-500">We typically reply within 15 minutes</p>
                            </div>
                        </div>

                        {supportSubmitted ? (
                            <div className="py-8 text-center space-y-2">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="text-base font-bold text-slate-900">Message Received!</h4>
                                <p className="text-xs text-slate-600">Our engineering support team will reach out to your email shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSupportSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Muhammad Yasir"
                                            value={supportForm.name}
                                            onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            value={supportForm.email}
                                            onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                                    <select
                                        value={supportForm.category}
                                        onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="ai">Claude AI Assistance Help</option>
                                        <option value="auth">Account, Login & OTP Issue</option>
                                        <option value="bug">Bug Report / Feedback</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">How can we help?</label>
                                    <textarea
                                        rows="3"
                                        required
                                        placeholder="Describe what you need assistance with..."
                                        value={supportForm.message}
                                        onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Send Support Request</span>
                                </button>
                            </form>
                        )}

                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Direct Email: <strong>support@aitaskmanager.com</strong></span>
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                24/7 Active
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 4. PRICING OVERVIEW MODAL                                 */}
            {/* ========================================================= */}
            {pricingOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPricingOpen(false)}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-extrabold text-slate-900">Simple, Transparent Plans</h3>
                            <p className="text-xs text-slate-500 mt-1">Start free, upgrade as you orchestrate larger projects with Claude AI</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Free Tier */}
                            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Starter</span>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-slate-900">$0</span>
                                        <span className="text-xs text-slate-500">/ forever</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2">Perfect for personal task management.</p>
                                    
                                    <div className="mt-5 space-y-2 text-xs text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Unlimited personal tasks & subtasks</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Claude 3.5 AI Task Decomposition</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>60-second OTP email verification</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setPricingOpen(false); onOpenAuth('register'); }}
                                    className="w-full mt-6 py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                                >
                                    Get Started Free
                                </button>
                            </div>

                            {/* Pro AI Tier */}
                            <div className="border-2 border-indigo-600 rounded-2xl p-6 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 relative flex flex-col justify-between shadow-lg shadow-indigo-600/10">
                                <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                                    Most Popular
                                </span>
                                <div>
                                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Pro AI Copilot</span>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-slate-900">$12</span>
                                        <span className="text-xs text-slate-500">/ month</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2">Autonomous execution & advanced team workflows.</p>
                                    
                                    <div className="mt-5 space-y-2 text-xs text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                                            <span>Everything in Free Starter</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                                            <span>Unlimited Claude 3.5 autonomous solutions</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                                            <span>Priority API rate limits & 24/7 support</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setPricingOpen(false); onOpenAuth('register'); }}
                                    className="w-full mt-6 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition cursor-pointer"
                                >
                                    Start 14-Day Pro Trial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Public Footer */}
            <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
                AI Task Manager &copy; {new Date().getFullYear()} — Built with React, Tailwind CSS, Node.js & Anthropic Claude 3.5.
            </footer>

        </div>
    );
}
