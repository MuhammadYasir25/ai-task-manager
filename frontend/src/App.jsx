import React, { useState, useEffect } from 'react';
import API from './api';
import Auth from './components/auth.jsx';
import Navbar from './components/Navbar.jsx';
import TaskModel from './components/TaskModel.jsx';
import TaskCard from './components/TaskCard.jsx';
import AdminPanel from './components/adminPanel.jsx';
import {
  Sparkles,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Layers
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
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

  if (!user && !loading) {
    return <Auth onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
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
            {/* Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Tasks</p>
                  <h4 className="text-xl font-bold text-slate-900">{stats.total}</h4>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">In Progress</p>
                  <h4 className="text-xl font-bold text-slate-900">{stats.inProgress}</h4>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Completed</p>
                  <h4 className="text-xl font-bold text-slate-900">{stats.completed}</h4>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">High / Urgent</p>
                  <h4 className="text-xl font-bold text-slate-900">{stats.urgent}</h4>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex p-1 bg-slate-200/70 border border-slate-200 rounded-xl">
                  {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${statusFilter === tab
                          ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {tab === 'in-progress' ? 'In Progress' : tab}
                    </button>
                  ))}
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs cursor-pointer"
                >
                  <option value="all">All Priorities</option>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>
            </div>

            {/* Task Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                <Sparkles className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm">Loading your tasks...</p>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 shadow-xs">
                <div className="inline-flex p-3 bg-indigo-600/10 text-indigo-400 rounded-xl mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">No tasks found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                  Create your first task and let Claude AI automatically break it down into actionable steps!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <TaskModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
