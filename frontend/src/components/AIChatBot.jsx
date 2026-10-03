import React, { useState, useRef, useEffect } from 'react';
import { 
    Sparkles, Send, X, Bot, User, Minimize2, Maximize2, 
    RefreshCw, Check, Copy, AlertCircle, ChevronDown, Flame
} from 'lucide-react';
import API from '../api';

export default function AIChatBot({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: `👋 Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your **Gemini AI Workspace Copilot**.\n\nI can analyze your active tasks, help you prioritize, or break down complex project goals into steps.\n\nHow can I help you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            inputRef.current?.focus();
        }
    }, [isOpen, messages]);

    const handleSendMessage = async (textToSend) => {
        const text = textToSend || inputValue;
        if (!text.trim() || loading) return;

        const userMsg = {
            role: 'user',
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInputValue('');
        setLoading(true);

        try {
            const { data } = await API.post('/chat', {
                message: userMsg.text,
                history: messages.slice(-5)
            });

            const botMsg = {
                role: 'assistant',
                text: data.reply || 'Here is what I recommend for your tasks.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error('Chat error:', err);
            const errorMsg = {
                role: 'assistant',
                text: `⚠️ ${err.response?.data?.message || err.message || 'Failed to connect to Gemini AI. Please try again.'}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const quickChips = [
        '📋 What tasks are pending?',
        '🔥 Which task is urgent?',
        '🎯 Help me break down a project',
        '💡 Productivity tip'
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* FLOATING CHAT WINDOW */}
            {isOpen && (
                <div className="mb-4 w-92 sm:w-[410px] h-[540px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    {/* Header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-between shadow-xs">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-sm font-bold leading-tight">Gemini AI Copilot</h3>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <p className="text-[11px] text-indigo-100 font-medium">Powered by Gemini 3.8 Flash</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
                        {messages.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs ${
                                        isUser 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white'
                                    }`}>
                                        {isUser ? 'You' : <Sparkles className="w-3.5 h-3.5" />}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`max-w-[78%] rounded-2xl p-3 shadow-2xs relative group leading-relaxed ${
                                        isUser
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                                    }`}>
                                        <div className="whitespace-pre-line font-sans">
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 text-[9px] opacity-70">
                                            <span>{msg.time}</span>
                                            {!isUser && (
                                                <button
                                                    onClick={() => handleCopy(msg.text, index)}
                                                    className="hover:opacity-100 flex items-center gap-0.5"
                                                    title="Copy response"
                                                >
                                                    {copiedIndex === index ? (
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="w-3 h-3 text-slate-500" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Loading Typing Indicator */}
                        {loading && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                </div>
                                <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl rounded-tl-none shadow-2xs flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    <span className="text-[11px] text-slate-500 font-medium ml-1.5">Gemini is thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {quickChips.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(chip.replace(/^[^\s]+\s/, ''))}
                                disabled={loading}
                                className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium rounded-lg transition border border-slate-200/60 shrink-0 cursor-pointer"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Input Footer */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Ask Gemini about your tasks..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={loading}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || loading}
                                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>
            )}

            {/* FLOATING ACTION TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative group flex items-center gap-2 p-3.5 sm:px-4 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/35 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                    isOpen ? 'ring-4 ring-indigo-500/20' : ''
                }`}
                title="Open Gemini AI Copilot"
            >
                {/* Glowing Ping Dot */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
                </span>

                <Bot className="w-5 h-5 text-white" />
                <span className="hidden sm:inline">Gemini AI Assistant</span>
            </button>

        </div>
    );
}
