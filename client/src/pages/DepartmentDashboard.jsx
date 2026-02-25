import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, LogOut, FileText, Clock,
    CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react';
import Hyperspeed from '../components/Hyperspeed';
import { hyperspeedPresets } from '../components/HyperSpeedPresets';

// Colour theme per-department
const DEPT_THEMES = {
    Canteen: { from: '#FF6B6B', to: '#EE5A24', accent: 'rgba(255,107,107,0.25)', border: 'border-red-500/40', icon: '🍽️' },
    Academic: { from: '#4834d4', to: '#686de0', accent: 'rgba(72,52,212,0.25)', border: 'border-indigo-500/40', icon: '📚' },
    Maintenance: { from: '#F79F1F', to: '#FFC312', accent: 'rgba(247,159,31,0.25)', border: 'border-amber-500/40', icon: '🔧' },
    Auditorium: { from: '#8854d0', to: '#a55eea', accent: 'rgba(136,84,208,0.25)', border: 'border-purple-500/40', icon: '🎭' },
    Administration: { from: '#20bf6b', to: '#26de81', accent: 'rgba(32,191,107,0.25)', border: 'border-emerald-500/40', icon: '🏛️' },
    Sports: { from: '#FA8231', to: '#FD9644', accent: 'rgba(250,130,49,0.25)', border: 'border-orange-500/40', icon: '⚽' },
    Others: { from: '#3867d6', to: '#4b7bec', accent: 'rgba(56,103,214,0.25)', border: 'border-blue-500/40', icon: '📋' },
};

const DepartmentDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const theme = DEPT_THEMES[user?.department] || DEPT_THEMES['Others'];
    const gradient = `linear-gradient(135deg, ${theme.from}, ${theme.to})`;

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [statsRes, complaintsRes] = await Promise.all([
                complaintService.getStats(),
                complaintService.getAll(),
            ]);
            setStats(statsRes.data.stats);
            setComplaints(complaintsRes.data.complaints);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => logout(), 500);
    };

    const statCards = [
        { label: 'Total', value: stats?.total || 0, icon: FileText, color: 'text-white/80', bg: 'bg-white/10' },
        { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'text-yellow-300', bg: 'bg-yellow-500/15' },
        { label: 'In Progress', value: stats?.inProgress || 0, icon: AlertCircle, color: 'text-blue-300', bg: 'bg-blue-500/15' },
        { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle, color: 'text-emerald-300', bg: 'bg-emerald-500/15' },
    ];

    const statusBadge = (status) => {
        const map = {
            pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'in-progress': 'bg-blue-500/20   text-blue-300   border-blue-500/30',
            resolved: 'bg-green-500/20  text-green-300  border-green-500/30',
            escalated: 'bg-red-500/20    text-red-300    border-red-500/30',
            'on-hold': 'bg-gray-500/20   text-gray-300   border-gray-500/30',
        };
        return map[status] || 'bg-white/10 text-white/60 border-white/20';
    };

    return (
        <motion.div
            className="min-h-screen relative"
            animate={{ opacity: isLoggingOut ? 0 : 1, scale: isLoggingOut ? 0.97 : 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* ── Hyperspeed animated background ── */}
            <div className="absolute inset-0 z-0">
                <Hyperspeed effectOptions={hyperspeedPresets.six} />
            </div>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/45 z-[1]" />

            {/* ── Loading overlay ── */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col items-center">
                            <div
                                className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white animate-spin"
                                style={{ borderTopColor: theme.from }}
                            />
                            <p className="mt-4 text-white/70 font-medium animate-pulse">Loading dashboard…</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main content ── */}
            <div className="relative z-10 min-h-screen">
                {/* Header */}
                <motion.header
                    className="bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Dept icon badge */}
                                <motion.div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/20"
                                    style={{ background: gradient }}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {theme.icon}
                                </motion.div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Department Dashboard</h1>
                                    <p className="text-sm font-medium" style={{ color: theme.from }}>
                                        {user?.department} Department
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Welcome banner */}
                    <motion.div
                        className="rounded-2xl p-6 mb-8 border border-white/10 overflow-hidden relative"
                        style={{ background: `linear-gradient(135deg, ${theme.from}22, ${theme.to}15)`, backdropFilter: 'blur(16px)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Subtle glow orb */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30"
                            style={{ background: theme.from }} />
                        <div className="relative z-10 flex items-center space-x-4">
                            <span className="text-5xl">{theme.icon}</span>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Welcome, {user?.name}
                                </h2>
                                <p className="text-white/50 text-sm mt-0.5">
                                    Manage and resolve complaints for the {user?.department} department
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                className={`rounded-xl p-6 ${card.bg} border border-white/10 backdrop-blur-md`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + i * 0.07 }}
                                whileHover={{ scale: 1.04 }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className={`text-xs font-semibold uppercase tracking-wider ${card.color}`}>
                                        {card.label}
                                    </p>
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                                <motion.p
                                    className={`text-4xl font-black ${card.color}`}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.07, type: 'spring' }}
                                >
                                    {card.value}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Complaints */}
                    <motion.div
                        className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        {/* Section header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <LayoutDashboard className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-bold text-white">Recent Complaints</h2>
                            </div>
                            <span className="text-xs text-white/40">{complaints.length} total</span>
                        </div>

                        <div className="divide-y divide-white/5">
                            {complaints.length === 0 ? (
                                <div className="text-center py-20">
                                    <FileText className="w-14 h-14 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 text-lg">No complaints yet</p>
                                    <p className="text-white/25 text-sm mt-1">New complaints will appear here</p>
                                </div>
                            ) : (
                                complaints.slice(0, 12).map((complaint, index) => (
                                    <motion.div
                                        key={complaint._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <Link
                                            to={`/department/complaint/${complaint._id}`}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                                                        {complaint.complaintId}
                                                    </span>
                                                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusBadge(complaint.status)}`}>
                                                        {complaint.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-white font-semibold text-sm truncate group-hover:text-white/90">
                                                    {complaint.title}
                                                </p>
                                                <p className="text-white/40 text-xs mt-0.5">
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors ml-4 flex-shrink-0" />
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default DepartmentDashboard;
