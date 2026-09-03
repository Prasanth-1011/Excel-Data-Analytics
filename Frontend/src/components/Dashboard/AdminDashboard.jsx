import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard({ user, onLogout }) {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [files, setFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, adminsRes, filesRes] = await Promise.all([
                axios.get('/admin/stats'),
                axios.get('/admin/users'),
                axios.get('/admin/admins'),
                axios.get('/admin/files')
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAdmins(adminsRes.data);
            setFiles(filesRes.data);

            if (user.root) {
                const pendingRes = await axios.get('/admin/pending-admins');
                setPendingAdmins(pendingRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivateAdmin = async (adminId) => {
        try {
            await axios.put(`/admin/activate-admin/${adminId}`);
            fetchData();
        } catch (error) {
            alert('Error activating admin');
        }
    };

    const handlePromoteToRoot = async (adminId) => {
        if (window.confirm('Are you sure you want to promote this admin to root?')) {
            try {
                await axios.put(`/admin/promote-root/${adminId}`);
                fetchData();
            } catch (error) {
                alert('Error promoting admin');
            }
        }
    };

    const handleRevokeRoot = async (adminId) => {
        if (window.confirm('Are you sure you want to revoke root privileges?')) {
            try {
                await axios.put(`/admin/revoke-root/${adminId}`);
                fetchData();
            } catch (error) {
                alert('Error revoking root');
            }
        }
    };

    const handleDeactivateUser = async (userId) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await axios.delete(`/admin/deactivate-user/${userId}`);
                fetchData();
            } catch (error) {
                alert('Error deactivating user');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Top Header Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white p-2 rounded-xl shadow-md shadow-purple-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                    Admin Console
                                </h1>
                                {user.root && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                                        Root Admin
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">System Control Center</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
                            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                                {user?.username}
                            </span>
                        </div>

                        <Link
                            to="/change-password"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Password
                        </Link>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</span>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Registered</span>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Admins</span>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalAdmins || 0}</span>
                            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Managers</span>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Files</span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalFiles || 0}</span>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Uploaded</span>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">{stats?.pendingAdmins || 0}</span>
                            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Action Required</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Tabs & Content Box */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    {/* Navigation Bar Pills */}
                    <div className="p-2 bg-slate-50/80 border-b border-slate-200/80 flex items-center gap-1 overflow-x-auto">
                        <button
                            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                activeTab === 'overview'
                                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Overview
                        </button>

                        <button
                            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                activeTab === 'users'
                                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Users ({users.length})
                        </button>

                        <button
                            onClick={() => { setActiveTab('admins'); setSearchQuery(''); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                activeTab === 'admins'
                                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admins ({admins.length})
                        </button>

                        {user.root && (
                            <button
                                onClick={() => { setActiveTab('pending'); setSearchQuery(''); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap relative ${
                                    activeTab === 'pending'
                                        ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending Admins
                                {pendingAdmins.length > 0 && (
                                    <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-1">
                                        {pendingAdmins.length}
                                    </span>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => { setActiveTab('files'); setSearchQuery(''); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                activeTab === 'files'
                                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Files ({files.length})
                        </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="p-6">
                        {/* TAB 1: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
                                    <div className="relative z-10 max-w-xl">
                                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            System Operational
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                                            Admin Control Workspace
                                        </h2>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                            Manage user accounts, review and approve admin requests, and monitor stored data files across the platform.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 hover:bg-slate-100/60 transition cursor-pointer" onClick={() => setActiveTab('users')}>
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-base mb-1">User Management</h3>
                                        <p className="text-xs text-slate-500 mb-3">View registered users, total uploads, and account statuses.</p>
                                        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                                            Manage Users &rarr;
                                        </span>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 hover:bg-slate-100/60 transition cursor-pointer" onClick={() => setActiveTab('admins')}>
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-base mb-1">Admin Roles</h3>
                                        <p className="text-xs text-slate-500 mb-3">Manage administrator privileges and root access controls.</p>
                                        <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                                            Manage Admins &rarr;
                                        </span>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 hover:bg-slate-100/60 transition cursor-pointer" onClick={() => setActiveTab('files')}>
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-base mb-1">System Files</h3>
                                        <p className="text-xs text-slate-500 mb-3">Monitor uploaded Excel datasets across all user accounts.</p>
                                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                            View Files &rarr;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: USERS */}
                        {activeTab === 'users' && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Registered Users</h2>
                                        <p className="text-xs text-slate-500">Manage user accounts and view metrics</p>
                                    </div>

                                    <div className="relative max-w-xs w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search users..."
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        />
                                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                                                <th className="py-3.5 px-6">User</th>
                                                <th className="py-3.5 px-6">Email Address</th>
                                                <th className="py-3.5 px-6">Files</th>
                                                <th className="py-3.5 px-6">Visualizations</th>
                                                <th className="py-3.5 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {users
                                                .filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((u) => (
                                                    <tr key={u._id} className="hover:bg-slate-50/80 transition duration-150">
                                                        <td className="py-4 px-6 font-semibold text-slate-800">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                                    {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
                                                                </div>
                                                                <span>{u.username}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-slate-600">{u.email}</td>
                                                        <td className="py-4 px-6">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                                {u.filesUploaded || 0} files
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                                {u.visualizationsAccessed || 0} views
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                                            {user.root && (
                                                                <button
                                                                    onClick={() => handleDeactivateUser(u._id)}
                                                                    className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                                                                >
                                                                    Deactivate
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

                        {/* TAB 3: ADMINS */}
                        {activeTab === 'admins' && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Administrator Accounts</h2>
                                        <p className="text-xs text-slate-500">View active administrators and privilege levels</p>
                                    </div>

                                    <div className="relative max-w-xs w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search admins..."
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        />
                                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                                                <th className="py-3.5 px-6">Admin</th>
                                                <th className="py-3.5 px-6">Email Address</th>
                                                <th className="py-3.5 px-6">Status</th>
                                                <th className="py-3.5 px-6">Role Level</th>
                                                <th className="py-3.5 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {admins
                                                .filter(a => a.username?.toLowerCase().includes(searchQuery.toLowerCase()) || a.email?.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((a) => (
                                                    <tr key={a._id} className="hover:bg-slate-50/80 transition duration-150">
                                                        <td className="py-4 px-6 font-semibold text-slate-800">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                                                                    {a.username ? a.username.charAt(0).toUpperCase() : 'A'}
                                                                </div>
                                                                <span>{a.username}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-slate-600">{a.email}</td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                                                a.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                            }`}>
                                                                {a.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            {a.root ? (
                                                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                                                                    ★ Root Admin
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center text-xs font-medium text-slate-500">
                                                                    Standard Admin
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                                            {user.root && a._id !== user.id && (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {!a.root && (
                                                                        <button
                                                                            onClick={() => handlePromoteToRoot(a._id)}
                                                                            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                                                                        >
                                                                            Promote to Root
                                                                        </button>
                                                                    )}
                                                                    {a.root && (
                                                                        <button
                                                                            onClick={() => handleRevokeRoot(a._id)}
                                                                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                                                                        >
                                                                            Revoke Root
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: PENDING ADMIMS */}
                        {activeTab === 'pending' && user.root && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Pending Admin Approvals</h2>
                                    <p className="text-xs text-slate-500">Review newly registered admin accounts waiting for root activation</p>
                                </div>

                                {pendingAdmins.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">No pending approvals</h3>
                                        <p className="text-xs text-slate-500">All registered admin accounts have been reviewed.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                                                    <th className="py-3.5 px-6">Username</th>
                                                    <th className="py-3.5 px-6">Email Address</th>
                                                    <th className="py-3.5 px-6">Registered Date</th>
                                                    <th className="py-3.5 px-6 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {pendingAdmins.map((a) => (
                                                    <tr key={a._id} className="hover:bg-slate-50/80 transition duration-150">
                                                        <td className="py-4 px-6 font-semibold text-slate-800">{a.username}</td>
                                                        <td className="py-4 px-6 text-slate-600">{a.email}</td>
                                                        <td className="py-4 px-6 text-slate-500 text-xs">
                                                            {new Date(a.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleActivateAdmin(a._id)}
                                                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition shadow-sm"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Activate Account
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 5: FILES */}
                        {activeTab === 'files' && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">All System Files</h2>
                                        <p className="text-xs text-slate-500">Overview of all uploaded Excel and CSV datasets</p>
                                    </div>

                                    <div className="relative max-w-xs w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search files..."
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        />
                                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                                                <th className="py-3.5 px-6">Filename</th>
                                                <th className="py-3.5 px-6">Uploaded By</th>
                                                <th className="py-3.5 px-6">Uploaded Date</th>
                                                <th className="py-3.5 px-6">Row Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {files
                                                .filter(f => f.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) || f.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((f) => (
                                                    <tr key={f._id} className="hover:bg-slate-50/80 transition duration-150">
                                                        <td className="py-4 px-6 font-semibold text-slate-800">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="truncate max-w-xs">{f.originalName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-slate-600">
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                                {f.userId?.username || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap text-xs">
                                                            {new Date(f.uploadedAt).toLocaleString()}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                                {f.parsedData?.length || 0} rows
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;