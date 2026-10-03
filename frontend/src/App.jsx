import React, { useState, useEffect } from 'react';
import API from './api';
import Auth from './components/auth.jsx';
import LandingPage from './components/LandingPage.jsx';
import Navbar from './components/Navbar.jsx';
import TaskModel from './components/TaskModel.jsx';
import TaskCard from './components/TaskCard.jsx';
import AdminPanel from './components/adminPanel.jsx';
import AIChatBot from './components/AIChatBot.jsx';
import {
  Sparkles,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Zap,
  CheckCircle2,
  Calendar,
  Compass
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);

  // Auth Modal State (For Landing Page)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Quick AI Prompt input
  const [quickPrompt, setQuickPrompt] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    setShowAdminView(false);
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleQuickDecompose = () => {
    if (!quickPrompt.trim()) return;
    setIsModalOpen(true);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    urgent: tasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length,
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // If user is NOT logged in, show the clean public Landing Page (Zero user data shown)
  if (!user && !loading) {
    return (
      <>
        <LandingPage onOpenAuth={handleOpenAuth} />
        {isAuthModalOpen && (
          <Auth
            initialMode={authModalMode}
            isModal={true}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setIsAuthModalOpen(false);
            }}
          />
        )}
      </>
    );
  }

  // Logged-in User Private Dashboard
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar with Solid Styling & 3-Bar Profile Modal */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenModal={() => setIsModalOpen(true)}
        taskStats={stats}
        onViewAdmin={() => setShowAdminView(!showAdminView)}
        showAdminView={showAdminView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {showAdminView ? (
          <AdminPanel onBack={() => setShowAdminView(false)} />
        ) : (
          <>
            {/* 1. SOLID VIBRANT STATS CARDS (Addressing Green Boxes) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 mb-8">
              {/* Card 1: Total Tasks - Solid Indigo Card */}
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white rounded-3xl p-5 shadow-lg shadow-indigo-600/25 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-between group cursor-default">
                <div>
                  <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Total Tasks</p>
                  <h4 className="text-3xl font-extrabold text-white mt-1">{stats.total}</h4>
                  <span className="text-[11px] text-indigo-200 mt-0.5 inline-block">Your workspace</span>
                </div>
                <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl text-white group-hover:scale-110 transition duration-300 shadow-inner">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: In Progress - Solid Blue Card */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg shadow-blue-600/25 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-between group cursor-default">
                <div>
                  <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider">In Progress</p>
                  <h4 className="text-3xl font-extrabold text-white mt-1">{stats.inProgress}</h4>
                  <span className="text-[11px] text-blue-200 mt-0.5 inline-block">Under execution</span>
                </div>
                <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl text-white group-hover:scale-110 transition duration-300 shadow-inner">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Completed - Solid Emerald Card */}
              <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg shadow-emerald-600/25 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-between group cursor-default">
                <div>
                  <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Completed</p>
                  <h4 className="text-3xl font-extrabold text-white mt-1">{stats.completed}</h4>
                  <span className="text-[11px] text-emerald-200 mt-0.5 inline-block">Tasks finished</span>
                </div>
                <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl text-white group-hover:scale-110 transition duration-300 shadow-inner">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              {/* Card 4: Urgent / High - Solid Rose Card */}
              <div className="bg-gradient-to-br from-rose-600 via-rose-600 to-pink-700 text-white rounded-3xl p-5 shadow-lg shadow-rose-600/25 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-between group cursor-default">
                <div>
                  <p className="text-xs font-semibold text-rose-100 uppercase tracking-wider">High / Urgent</p>
                  <h4 className="text-3xl font-extrabold text-white mt-1">{stats.urgent}</h4>
                  <span className="text-[11px] text-rose-200 mt-0.5 inline-block">High priority</span>
                </div>
                <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl text-white group-hover:scale-110 transition duration-300 shadow-inner">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* 2. SOLID FILTER & SEARCH BAR (Addressing Green Boxes) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 mb-8 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search input with solid focus */}
              <div className="relative w-full md:w-88">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search your tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
                />
              </div>

              {/* Solid Pills & Dropdown */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex p-1 bg-slate-100 border border-slate-200/90 rounded-xl shadow-2xs">
                  {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                        statusFilter === tab
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {tab === 'in-progress' ? 'In Progress' : tab}
                    </button>
                  ))}
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer shadow-2xs"
                >
                  <option value="all">All Priorities</option>
                  <option value="Urgent">Urgent Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* 3. BALANCED 2-COLUMN DASHBOARD LAYOUT (Covers the Purple Box / White Space) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: YOUR PRIVATE TASKS (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">Your Tasks</h2>
                    <span className="px-2.5 py-0.5 bg-slate-200/80 text-slate-700 rounded-full text-xs font-bold">
                      {filteredTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Task</span>
                  </button>
                </div>

                {filteredTasks.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">No tasks found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                      {tasks.length === 0 
                        ? 'Your workspace is currently empty. Click below to create your first task!'
                        : 'No tasks match your current search and filter settings.'}
                    </p>
                    {tasks.length === 0 && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
                      >
                        + Create Your First Task
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: AI PRODUCTIVITY HUB & SAAS BANNER (5 Cols) - Covers the blank space! */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* A. Professional SaaS Tech Banner Image Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl relative group">
                  <img 
                    src="/ai-banner.jpg" 
                    alt="AI Task Automation Engine" 
                    className="w-full h-52 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/80 text-white backdrop-blur-md w-fit mb-2 shadow-sm">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      Claude 3.5 Sonnet Engine Active
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      Autonomous AI Workflow Assistant
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Decomposes complex goals into actionable subtasks and produces executable solutions.
                    </p>
                  </div>
                </div>

                {/* B. AI Quick Goal Breakdown Input */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">AI Quick Decompose</h4>
                        <p className="text-[11px] text-slate-500">Transform any goal into subtasks</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ready
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., Build full-stack portfolio with React..."
                        value={quickPrompt}
                        onChange={(e) => setQuickPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleQuickDecompose();
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-20 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
                      />
                      <button
                        onClick={handleQuickDecompose}
                        className="absolute right-1.5 top-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                      >
                        AI Plan
                      </button>
                    </div>

                    {/* Suggestion Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        '🎯 Full-Stack Portfolio',
                        '🚀 Docker & CI/CD Pipeline',
                        '📊 Sprint Milestone Prep',
                      ].map((promptText) => (
                        <button
                          key={promptText}
                          onClick={() => {
                            setQuickPrompt(promptText.replace(/^[^\s]+\s/, ''));
                          }}
                          className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2.5 py-1 rounded-lg transition border border-slate-200/60 cursor-pointer"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* C. Smart Productivity & Completion Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Daily Productivity Score</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Done
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      💡 <strong>Pro Tip:</strong> Tasks with 3 to 5 automated subtasks have a <strong>45% higher completion rate</strong>. Use Claude AI subtask decomposition for major milestones!
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </>
        )}
      </main>

      {/* Floating Gemini AI Workspace Copilot */}
      <AIChatBot user={user} />

      {/* Task Creation Modal */}
      {isModalOpen && (
        <TaskModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
