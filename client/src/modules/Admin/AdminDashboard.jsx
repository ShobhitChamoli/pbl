import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import AuthContext from '../../context/AuthContext';
import { Card, Button, Input, Badge, LoadingSpinner, StatCard, Modal } from '../../components/UI';
import { Users, TrendingUp, BookOpen, Layers, UserCheck, Settings, Download, Search, Filter, Calendar, AlertTriangle, Clock, Plus, Send, FileText, CheckCircle, MoreHorizontal, LogOut, X } from 'lucide-react';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [vivaSessions, setVivaSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student' });
    const [creatingUser, setCreatingUser] = useState(false);

    // Modal States
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false); // New Extend Modal
    const [projectFilter, setProjectFilter] = useState('all'); // 'all' | 'completed' | 'pending'
    const [searchTerm, setSearchTerm] = useState('');

    // Form States
    const [newBatch, setNewBatch] = useState({ name: '', title: '', batch: '', semester: '' });
    const [evalPeriod, setEvalPeriod] = useState({ title: '', startDate: '', endDate: '' }); // Replaced newEval
    const [assignData, setAssignData] = useState({ projectId: '', mentorId: '' });
    const [extendDate, setExtendDate] = useState(''); // New State for extension

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsRes, projectsRes, mentorsRes, coursesRes, sessionsRes] = await Promise.all([
                axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/auth/mentors', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/viva-sessions', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStats(statsRes.data);
            setProjects(projectsRes.data);
            setMentors(mentorsRes.data);
            setCourses(coursesRes.data);
            setVivaSessions(sessionsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/courses', newBatch, { headers: { Authorization: `Bearer ${token}` } });
            alert('Batch created successfully!');
            setIsBatchModalOpen(false);
            setNewBatch({ name: '', batch: '', semester: '' });
            fetchData();
        } catch (error) {
            alert('Failed to create batch');
        }
    };

    const handleCreateEvalPeriod = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/evaluation-period', evalPeriod, { headers: { Authorization: `Bearer ${token}` } });
            alert('Evaluation period created and mentors notified!');
            setIsEvalModalOpen(false);
            setEvalPeriod({ title: '', startDate: '', endDate: '' });
            // fetchData(); // No need to refetch all, maybe just period if we displayed it
        } catch (error) {
            alert('Failed to create evaluation period');
        }
    };

    const handleSendReminder = async () => {
        if (!confirm("Are you sure you want to send a reminder to all mentors?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/send-reminder', {}, { headers: { Authorization: `Bearer ${token}` } });
            alert('Reminders sent successfully!');
        } catch (error) {
            alert('Failed to send reminders. Ensure an evaluation period is active.');
        }
    };

    const handleExtendTime = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/extend-deadline', { newDate: extendDate }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Deadline extended and notifications sent!');
            setIsExtendModalOpen(false);
            setExtendDate('');
        } catch (error) {
            alert('Failed to extend deadline');
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/assign', { projectId: assignData.projectId, mentorId: assignData.mentorId }, { headers: { Authorization: `Bearer ${token}` } });
            setIsAssignModalOpen(false);
            setAssignData({ projectId: '', mentorId: '' });
            fetchData();
            alert('Mentor assigned successfully');
        } catch (error) {
            alert('Failed to assign mentor');
        }
    };

    const openAssignModal = (project) => {
        setAssignData({ projectId: project.id, mentorId: project.mentorId || '' });
        setIsAssignModalOpen(true);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreatingUser(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/users', newUser, { headers: { Authorization: `Bearer ${token}` } });
            alert('User created successfully!');
            setNewUser({ name: '', email: '', password: '', role: 'student' });
            fetchData(); // Refresh stats/mentors
        } catch (error) {
            alert('Failed to create user: ' + (error.response?.data?.message || error.message));
        } finally {
            setCreatingUser(false);
        }
    };



    if (loading) return <LoadingSpinner size="lg" />;

    // Safety check for stats object
    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <AlertTriangle size={48} className="text-amber-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Failed to load dashboard data</h3>
                <p className="mb-4">Please try refreshing the page.</p>
                <Button onClick={fetchData} variant="outline" size="sm">Retry</Button>
            </div>
        );
    }

    // Ensure safe access to stats properties
    const safeStats = {
        totalStudents: stats.totalStudents || 0,
        totalMentors: stats.totalMentors || 0,
        totalProjects: stats.totalProjects || 0,
        evaluatedProjects: stats.evaluatedProjects || 0,
        pendingProjects: stats.pendingProjects || 0
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
            {/* Header */}
            <div className="mb-8 slide-up flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
                    <p className="text-slate-500 font-medium">Overview of institution performance</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={async () => {
                            if (window.confirm("⚠️ DANGER: This will delete ALL users, projects, and courses. Only Admin accounts will remain. Are you sure?")) {
                                try {
                                    const token = localStorage.getItem('token');
                                    await axios.post('/api/admin/reset', {}, { headers: { Authorization: `Bearer ${token}` } });
                                    alert('System reset successfully.');
                                    fetchData();
                                } catch (e) {
                                    alert('Reset failed');
                                }
                            }
                        }}
                    >
                        <AlertTriangle size={18} className="mr-2" /> Reset System
                    </Button>
                    <Button variant="outline"><Settings size={18} /> Settings</Button>
                    <Button variant="secondary" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50"><LogOut size={18} /> Logout</Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 slide-up mb-8">
                <StatCard title="Total Students" value={safeStats.totalStudents} icon={<Users />} />
                <StatCard title="Total Mentors" value={safeStats.totalMentors} icon={<UserCheck />} />
                <StatCard title="Total Projects" value={safeStats.totalProjects} icon={<Layers />} />
                <StatCard title="Evaluated" value={`${safeStats.evaluatedProjects} / ${safeStats.totalProjects}`} icon={<TrendingUp />} />
            </div>

            {/* Control Panels Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* LEFT: Academic Control Panel */}
                <Card className="slide-up flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                            <BookOpen className="text-primary" size={20} /> Academic Control Panel
                        </h2>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => setIsBatchModalOpen(true)} className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
                                <Plus size={14} /> Create Batch
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Search courses or batches..."
                            />
                        </div>
                        <Button variant="outline" className="h-10 px-3 text-xs">Filter</Button>
                    </div>

                    {/* Active Courses Table */}
                    <div className="overflow-x-auto flex-1 h-64 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Course Name</th>
                                    <th className="px-4 py-3">Batch</th>
                                    <th className="px-4 py-3 text-center">Students</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {courses.length > 0 ? courses.map((course, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-4 py-3 font-medium text-slate-800">{course.name}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{course.batch}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{course.studentCount || 0}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="success">{course.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                                                ...
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-slate-400 italic">
                                            No courses found. Add a new batch to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pt-4 mt-auto border-t border-slate-100 flex gap-3">
                        <Button variant="outline" className="flex-1 text-xs justify-center"><Users size={14} className="mr-2" /> View Students</Button>
                        <Button variant="outline" className="flex-1 text-xs justify-center"><UserCheck size={14} className="mr-2" /> Assign Faculty</Button>
                    </div>
                </Card>

                {/* RIGHT: Evaluation Control Center */}
                <Card className="slide-up flex flex-col h-full bg-slate-50/50 border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                            <TrendingUp className="text-primary" size={20} /> Evaluation Control Center
                        </h2>
                        <Button size="sm" variant="outline" className="h-8 px-3 text-xs bg-white hover:bg-slate-50 flex items-center gap-1 shadow-sm">
                            <Settings size={14} /> Config
                        </Button>
                    </div>

                    {/* Mini Stats Row */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Completion Rate</div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-extrabold text-emerald-600">
                                    {safeStats.totalProjects ? Math.round((safeStats.evaluatedProjects / safeStats.totalProjects) * 100) : 0}%
                                </span>
                                {safeStats.totalProjects > 0 && <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</div>}
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${safeStats.totalProjects ? (safeStats.evaluatedProjects / safeStats.totalProjects) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                                <div className="text-2xl font-bold text-slate-800">{safeStats.evaluatedProjects}</div>
                                <div className="text-xs text-slate-500 font-medium">Completed</div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                                <div className="text-2xl font-bold text-amber-600">{safeStats.pendingProjects}</div>
                                <div className="text-xs text-slate-500 font-medium">Pending</div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Section (Real Logic) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">System Alerts</h4>
                        <div className="space-y-3 h-32 overflow-y-auto">
                            {vivaSessions.length > 0 && (
                                <div className="text-xs font-bold text-blue-600 mb-2">Upcoming Sessions:</div>
                            )}
                            {vivaSessions.map(session => (
                                <div key={session.id} className="flex items-center gap-2 text-slate-600 text-sm p-1">
                                    <Calendar size={14} className="text-blue-500" />
                                    <span>{session.title} ({new Date(session.date).toLocaleDateString()})</span>
                                </div>
                            ))}

                            {safeStats.pendingProjects > 0 ? (
                                <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">{safeStats.pendingProjects} Assignments Pending</div>
                                        <div className="text-xs text-slate-500">Students complicate project submission</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-400 text-sm p-2">
                                    <CheckCircle size={16} /> All systems operational.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => setIsEvalModalOpen(true)} className="justify-center text-xs h-10 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"><Plus size={14} className="mr-2" /> Create Eval</Button>
                        <Button variant="outline" onClick={handleSendReminder} className="justify-center text-xs h-10">Send Reminder</Button>
                        <Button variant="outline" onClick={() => setIsExtendModalOpen(true)} className="justify-center text-xs h-10">Extend Time</Button>
                        <Button variant="outline" className="justify-center text-xs h-10"><Download size={14} className="mr-2" /> Export Report</Button>
                    </div>
                </Card>
            </div >

            {/* User Creation Section */}
            < Card className="slide-up mb-8" >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserCheck className="text-primary" /> User Management
                    </h2>
                </div>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input
                        label="Name"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Email Address"
                        value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                        <div className="relative group">
                            <select
                                className="glass-input appearance-none bg-no-repeat bg-right pr-6"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="mentor">Mentor</option>
                            </select>
                        </div>
                    </div>

                    {newUser.role === 'mentor' && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Course</label>
                            <div className="relative group">
                                <select
                                    className="glass-input appearance-none bg-no-repeat bg-right pr-6"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                    value={newUser.courseCode || ''}
                                    onChange={e => setNewUser({ ...newUser, courseCode: e.target.value })}
                                >
                                    <option value="">Select Course...</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.name}>{c.name} ({c.batch})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <Button type="submit" className="w-full py-3" disabled={creatingUser} loading={creatingUser}>
                            Create User
                        </Button>
                    </div>
                </form>
            </Card >

            <Card className="slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Layers className="text-primary" /> Project Management & Assignment
                    </h2>
                    <Button variant="outline" onClick={() => { setProjectFilter('all'); setIsProjectModalOpen(true); }} className="text-sm">
                        View All Details
                    </Button>
                </div>

                {/* Summary View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors group"
                        onClick={() => { setProjectFilter('completed'); setIsProjectModalOpen(true); }}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-emerald-800 font-bold text-lg">Completed Projects</h3>
                                <p className="text-emerald-600 text-sm">Evaluated and Graded</p>
                            </div>
                            <div className="text-3xl font-extrabold text-emerald-600 bg-white px-4 py-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                {safeStats.evaluatedProjects}
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-amber-50 border border-amber-100 p-4 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors group"
                        onClick={() => { setProjectFilter('pending'); setIsProjectModalOpen(true); }}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-amber-800 font-bold text-lg">Pending Projects</h3>
                                <p className="text-amber-600 text-sm">Awaiting Evaluation</p>
                            </div>
                            <div className="text-3xl font-extrabold text-amber-600 bg-white px-4 py-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                {safeStats.pendingProjects}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Project Details Modal */}
            <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Project Management" maxWidth="max-w-6xl">
                <div className="flex flex-col h-[70vh]">
                    {/* Search & Filter Controls */}
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Search by Project Title, Team Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setProjectFilter('all')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${projectFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>All</button>
                            <button onClick={() => setProjectFilter('completed')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${projectFilter === 'completed' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Completed</button>
                            <button onClick={() => setProjectFilter('pending')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${projectFilter === 'pending' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'}`}>Pending</button>
                        </div>
                    </div>

                    {/* Scrollable Table Container */}
                    <div className="overflow-auto flex-1 border border-slate-200 rounded-xl">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 whitespace-nowrap">Project</th>
                                    <th className="p-4 font-semibold text-slate-600 whitespace-nowrap">Team</th>
                                    <th className="p-4 font-semibold text-slate-600 whitespace-nowrap">Course</th>
                                    <th className="p-4 font-semibold text-slate-600 whitespace-nowrap">Assigned Mentor</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {projects
                                    .filter(p => {
                                        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.teamName.toLowerCase().includes(searchTerm.toLowerCase());
                                        const matchesFilter = projectFilter === 'all'
                                            ? true
                                            : projectFilter === 'completed'
                                                ? p.evaluation
                                                : !p.evaluation;
                                        return matchesSearch && matchesFilter;
                                    })
                                    .map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{p.title}</div>
                                                <div className="text-xs text-slate-500">{p.domain}</div>
                                            </td>
                                            <td className="p-4 text-slate-600 whitespace-nowrap">{p.teamName}</td>
                                            <td className="p-4 text-slate-600 whitespace-nowrap">{p.courseCode || 'N/A'} <span className="text-slate-400 text-xs">Sem {p.semester}</span></td>
                                            <td className="p-4 whitespace-nowrap">
                                                {p.mentorId ? (
                                                    <Badge variant="success">{mentors.find(m => m.id === p.mentorId)?.name || 'Unknown'}</Badge>
                                                ) : (
                                                    <Badge variant="warning">Unassigned</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => { setIsProjectModalOpen(false); openAssignModal(p); }}
                                                    className="text-xs h-8 inline-flex items-center gap-1"
                                                >
                                                    <Layers size={12} /> Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                {projects.filter(p => {
                                    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.teamName.toLowerCase().includes(searchTerm.toLowerCase());
                                    const matchesFilter = projectFilter === 'all'
                                        ? true
                                        : projectFilter === 'completed'
                                            ? p.evaluation
                                            : !p.evaluation;
                                    return matchesSearch && matchesFilter;
                                }).length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-slate-500 italic">No projects found matching filter.</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pt-4 flex justify-between text-xs text-slate-500">
                        <div>Showing {projects.filter(p => {
                            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.teamName.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesFilter = projectFilter === 'all'
                                ? true
                                : projectFilter === 'completed'
                                    ? p.evaluation
                                    : !p.evaluation;
                            return matchesSearch && matchesFilter;
                        }).length} projects</div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Completed: {safeStats.evaluatedProjects}</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Pending: {safeStats.pendingProjects}</span>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Assign Mentor Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Mentor">
                <form onSubmit={handleAssign} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Mentor</label>
                        <div className="relative group">
                            <select
                                className="glass-input w-full appearance-none bg-no-repeat bg-right pr-6"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                value={assignData.mentorId}
                                onChange={e => setAssignData({ ...assignData, mentorId: e.target.value })}
                                required
                            >
                                <option value="">Select Mentor...</option>
                                {mentors.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.courseCode || 'No Course'})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Assign Mentor</Button>
                </form>
            </Modal>

            {/* Create Batch Modal */}
            <Modal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} title="Create New Batch">
                <form onSubmit={handleCreateBatch} className="space-y-4">
                    <Input
                        label="Course Title"
                        placeholder="e.g. Full Stack Development"
                        value={newBatch.title}
                        onChange={e => setNewBatch({ ...newBatch, title: e.target.value })}
                        required
                    />
                    <Input
                        label="Course Code"
                        placeholder="e.g. PCS-693"
                        value={newBatch.name}
                        onChange={e => setNewBatch({ ...newBatch, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Batch / Year"
                        placeholder="e.g. 2024-2025"
                        value={newBatch.batch}
                        onChange={e => setNewBatch({ ...newBatch, batch: e.target.value })}
                        required
                    />
                    <Input
                        label="Semester"
                        placeholder="e.g. 6"
                        type="number"
                        value={newBatch.semester}
                        onChange={e => setNewBatch({ ...newBatch, semester: e.target.value })}
                        required
                    />
                    <Button type="submit" className="w-full">Create Batch</Button>
                </form>
            </Modal>

            {/* Create Evaluation Period Modal */}
            <Modal isOpen={isEvalModalOpen} onClose={() => setIsEvalModalOpen(false)} title="Create Evaluation Period">
                <form onSubmit={handleCreateEvalPeriod} className="space-y-4">
                    <Input
                        label="Period Title"
                        placeholder="e.g. End Semester Evaluation"
                        value={evalPeriod.title}
                        onChange={e => setEvalPeriod({ ...evalPeriod, title: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            value={evalPeriod.startDate}
                            onChange={e => setEvalPeriod({ ...evalPeriod, startDate: e.target.value })}
                            required
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={evalPeriod.endDate}
                            onChange={e => setEvalPeriod({ ...evalPeriod, endDate: e.target.value })}
                            required
                        />
                    </div>
                    <p className="text-xs text-slate-500">Creating this period will notify all mentors to conduct evaluations within these dates.</p>
                    <Button type="submit" className="w-full">Set Period & Notify</Button>
                </form>
            </Modal>

            {/* Extend Deadline Modal */}
            <Modal isOpen={isExtendModalOpen} onClose={() => setIsExtendModalOpen(false)} title="Extend Deadline">
                <form onSubmit={handleExtendTime} className="space-y-4">
                    <Input
                        label="New End Date"
                        type="date"
                        value={extendDate}
                        onChange={e => setExtendDate(e.target.value)}
                        required
                    />
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                        <p className="font-semibold mb-1">Notice:</p>
                        <p>This will update the evaluation deadline and automatically notify <strong>ALL Mentors and Students</strong> about the extension.</p>
                    </div>
                    <Button type="submit" className="w-full">Extend & Notify All</Button>
                </form>
            </Modal>
        </div >
    );
};

export default AdminDashboard;
