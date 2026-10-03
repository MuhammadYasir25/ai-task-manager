import React, { useState, useEffect } from 'react';
import {
    Users,
    Layers,
    CheckCircle,
    Zap,
    Shield,
    Trash2,
    ArrowLeft,
    Crown,
    UserPlus,
    Edit2,
    Activity,
    Download,
    X,
    Search,
    Check,
    Server
} from 'lucide-react';
import API from '../api';

export default function AdminPanel({ onBack }) {
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'activity'
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchUser, setSearchUser] = useState('');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user' });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, tasksRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get('/admin/users'),
                API.get('/admin/tasks'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAllTasks(tasksRes.data);
        } catch (err) {
            console.error('Failed to load admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add User
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/users', userForm);
            setIsAddModalOpen(false);
            setUserForm({ name: '', email: '', password: '', role: 'user' });
            fetchAdminData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    // Update User
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/admin/users/${editingUser._id}`, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
            });
            setEditingUser(null);
            fetchAdminData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating user');
        }
    };

    // Delete User
    const handleDeleteUser = async (userId, userEmail) => {
        if (userRole === 'admin') {
            alert('Cannot delete the primary Super Admin account.');
            return;
        }
        if (!window.confirm('Delete this user and all their associated tasks permanently?')) return;
        try {
            await API.delete(`/admin/users/${userId}`);
            fetchAdminData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting user');
        }
    };

    // Export Data to JSON
    const handleExportData = () => {
        const backup = {
            exportDate: new Date().toISOString(),
            stats,
            users,
            tasks: allTasks,
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `ai-task-manager-backup-${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUser.toLowerCase())
    );

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-400">
                <Zap className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                <p>Initializing Super Admin Center...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* Super Admin Identity Banner */}
            <div className="bg-gradient-to-r from-amber-50 via-white to-indigo-50/40 border border-amber-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-amber-100 text-amber-700 border border-amber-300 rounded-2xl shadow-2xs">
                        <Crown className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-bold text-slate-900">Muhammad Yasir</h2>
                            <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider">
                                Super Admin
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Full Administrative Control Access
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                    <button
                        onClick={handleExportData}
                        className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Backup</span>
                    </button>
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white shadow-xs text-xs font-medium px-4 py-2 rounded-xl transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </div>

            {/* System Metrics Bar */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Users</p>
                            <h4 className="text-xl font-bold text-slate-900">{stats.totalUsers}</h4>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Tasks</p>
                            <h4 className="text-xl font-bold text-slate-900">{stats.totalTasks}</h4>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Completed</p>
                            <h4 className="text-xl font-bold text-slate-900">{stats.completedTasks}</h4>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs hover:shadow-md transition">
                        <div className="p-3 bg-amber-500/10 text-indigo-600 font-bold rounded-xl">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">AI Solved</p>
                            <h4 className="text-xl font-bold text-slate-900">{stats.aiSolvedTasks}</h4>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs: Users vs Global Activity */}
            <div className="flex items-center space-x-4 border-b border-slate-200 pb-3">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center space-x-2 text-sm font-semibold pb-2 -mb-3 transition ${activeTab === 'users'
                        ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    <span>User Management ({users.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex items-center space-x-2 text-sm font-semibold pb-2 -mb-3 transition ${activeTab === 'activity'
                        ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <Activity className="w-4 h-4" />
                    <span>System Activity & Task Feed ({allTasks.length})</span>
                </button>
            </div>

            {/* TAB 1: User Management */}
            {activeTab === 'users' && (
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Search user by name/email..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-600"
                            />
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md transition"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Add New User</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 uppercase text-slate-400 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5">User</th>
                                    <th className="p-3.5">Email</th>
                                    <th className="p-3.5">Role</th>
                                    <th className="p-3.5">Tasks (Done / Total)</th>
                                    <th className="p-3.5">Joined Date</th>
                                    <th className="p-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/70 transition">
                                        <td className="p-3.5 font-medium text-white flex items-center gap-2">
                                            {u.role === 'admin' ? (
                                                <Crown className="w-4 h-4 text-indigo-600 font-bold" />
                                            ) : (
                                                <Users className="w-4 h-4 text-slate-500" />
                                            )}
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="p-3.5 text-slate-400">{u.email}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin'
                                                ? 'bg-amber-500/10 text-indigo-600 font-bold border border-amber-500/30'
                                                : 'bg-slate-800 text-slate-400'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <strong className="text-emerald-400">{u.completedCount || 0}</strong> / {u.taskCount || 0}
                                        </td>
                                        <td className="p-3.5 text-slate-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3.5 text-right space-x-2">
                                            <button
                                                onClick={() => setEditingUser(u)}
                                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                                                title="Edit User"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id, u.email)}
                                                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: Global Activity & Task Feed */}
            {activeTab === 'activity' && (
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-slate-200">
                        <h3 className="text-sm font-semibold text-white">All User Activities & Live System Tasks</h3>
                        <p className="text-xs text-slate-500 font-medium">Review task creations, subtask progress, and AI execution outputs across all accounts</p>
                    </div>

                    <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                        {allTasks.map((task) => (
                            <div key={task._id} className="p-4 hover:bg-slate-800/30 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 rounded text-slate-700">
                                            Author: {task.user?.name || 'Unknown'} ({task.user?.email})
                                        </span>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-indigo-600 font-bold'
                                            }`}>
                                            {task.status}
                                        </span>
                                        {task.aiSolution && (
                                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                AI Solved
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-medium text-white">{task.title}</h4>
                                    {task.description && (
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{task.description}</p>
                                    )}
                                </div>

                                <div className="text-xs text-slate-500 text-right shrink-0">
                                    <p>{new Date(task.createdAt).toLocaleString()}</p>
                                    <p className="text-[11px] text-slate-400 mt-1">{task.subtasks?.length || 0} Subtasks</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL: Add New User */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-indigo-400" />
                                <span>Add User to System</span>
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Role</label>
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                                >
                                    <option value="user">Regular User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Edit Existing User */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-indigo-600 font-bold" />
                                <span>Edit User Details</span>
                            </h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-4 mt-4 text-xs">
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-600 cursor-pointer"
                                >
                                    <option value="user">Regular User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
