import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Clock, CheckCircle, AlertCircle,
    PlusCircle, Search, LogOut, ArrowLeft, Upload
} from 'lucide-react';
import LetterAnimation from '../components/LetterAnimation';
import CategoryWheel from '../components/CategoryWheel';
import SuccessAnimation from '../components/SuccessAnimation';
import PageTransition from '../components/PageTransition';
import Hyperspeed from '../components/Hyperspeed';
import { hyperspeedPresets } from '../components/HyperSpeedPresets';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // View state machine: 'letter' → 'dashboard' → 'wheel' → 'form' → 'success'
    const [view, setView] = useState(() => {
        const showLetter = sessionStorage.getItem('showLetterAnimation');
        return showLetter === 'true' ? 'letter' : 'dashboard';
    });

    // Form state
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        anonymous: false,
    });
    const [files, setFiles] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, complaintsRes] = await Promise.all([
                complaintService.getStats(),
                complaintService.getAll(),
            ]);
            setStats(statsRes.data.stats);
            setRecentComplaints(complaintsRes.data.complaints.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLetterComplete = useCallback(() => {
        sessionStorage.removeItem('showLetterAnimation');
        setView('dashboard');
    }, []);

    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        setFormData(prev => ({ ...prev, category }));
        setView('form');
    }, []);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('category', selectedCategory);
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('priority', formData.priority);
            submitData.append('anonymous', formData.anonymous);

            files.forEach((file) => {
                submitData.append('attachments', file);
            });

            await complaintService.create(submitData);
            setView('success');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to submit complaint';
            setFormError(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    const handleSuccessComplete = useCallback(() => {
        // Reset form
        setFormData({ title: '', description: '', priority: 'medium', anonymous: false });
        setFiles([]);
        setSelectedCategory('');
        setView('dashboard');
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            logout();
        }, 500);
    };



    // ─── STAT CARDS DATA ─────────────────────
    const statCards = [
        { label: 'Total Complaints', value: stats?.total || 0, icon: FileText, color: 'gray', borderColor: 'border-gray-500/50', textColor: 'text-gray-200', iconColor: 'text-gray-400' },
        { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'yellow', borderColor: 'border-yellow-500/50', textColor: 'text-yellow-300', iconColor: 'text-yellow-400' },
        { label: 'In Progress', value: stats?.inProgress || 0, icon: AlertCircle, color: 'blue', borderColor: 'border-blue-500/50', textColor: 'text-blue-300', iconColor: 'text-blue-400' },
        { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle, color: 'green', borderColor: 'border-green-500/50', textColor: 'text-green-300', iconColor: 'text-green-400' },
    ];

    return (
        <motion.div
            className="min-h-screen relative"
            animate={{ opacity: isLoggingOut ? 0 : 1, scale: isLoggingOut ? 0.95 : 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Hyperspeed background */}
            <div className="absolute inset-0 z-0">
                <Hyperspeed effectOptions={hyperspeedPresets.six} />
            </div>
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40 z-[1]" />

            {/* Letter Animation Overlay */}
            <AnimatePresence>
                {view === 'letter' && (
                    <LetterAnimation
                        userName={user?.name}
                        onComplete={handleLetterComplete}
                    />
                )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
                {loading && view !== 'letter' && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex flex-col items-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="w-16 h-16 border-4 border-white/10 border-t-orange-500 rounded-full animate-spin shadow-lg" />
                            <p className="mt-4 text-white/80 font-medium tracking-wide animate-pulse">
                                Initializing Portal...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Animation Overlay */}
            <AnimatePresence>
                {view === 'success' && (
                    <SuccessAnimation onComplete={handleSuccessComplete} />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Header */}
                <motion.header
                    className="bg-black/40 backdrop-blur-xl shadow-2xl border-b border-white/10"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center p-2 ring-1 ring-white/20"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <img
                                        src="/assets/portal_logo.jpeg"
                                        alt="NFSU Logo"
                                        className="w-full h-full object-contain rounded-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <span className="text-xl font-bold text-orange-400" style={{ display: 'none' }}>N</span>
                                </motion.div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
                                    <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
                                </div>
                            </div>

                            <motion.button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition-colors ripple"
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
                    <AnimatePresence mode="wait">
                        {/* ─── DASHBOARD VIEW ─────────────────── */}
                        {view === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <motion.button
                                        onClick={() => setView('wheel')}
                                        className="group bg-gradient-to-r from-orange-600/80 to-red-600/80 backdrop-blur-md rounded-2xl p-8 text-white shadow-lg text-left hover-lift ripple border border-orange-500/30"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                                <PlusCircle className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">Submit Complaint</h3>
                                                <p className="text-orange-200">Register a new complaint</p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Link
                                            to="/student/track-complaints"
                                            className="group bg-gradient-to-r from-amber-600/80 to-yellow-600/80 backdrop-blur-md rounded-2xl p-8 text-white shadow-lg block hover-lift ripple border border-amber-500/30"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                                    <Search className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1">Track Complaints</h3>
                                                    <p className="text-amber-200">View all your complaints</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
                                    {statCards.map((card) => (
                                        <motion.div
                                            key={card.label}
                                            className={`bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-lg hover-lift border-l-4 ${card.borderColor} border border-white/10`}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className={`text-sm font-semibold ${card.textColor}`}>{card.label}</p>
                                                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                                            </div>
                                            <motion.p
                                                className={`text-4xl font-bold ${card.textColor}`}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3, type: 'spring' }}
                                            >
                                                {card.value}
                                            </motion.p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Recent Complaints */}
                                <motion.div
                                    className="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">Recent Complaints</h2>

                                    {recentComplaints.length === 0 ? (
                                        <div className="text-center py-16">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                                <p className="text-gray-400 text-lg mb-4">No complaints yet</p>
                                                <motion.button
                                                    onClick={() => setView('wheel')}
                                                    className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors ripple"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <PlusCircle className="w-5 h-5 mr-2" />
                                                    Submit your first complaint
                                                </motion.button>
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentComplaints.map((complaint, index) => (
                                                <motion.div
                                                    key={complaint._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                >
                                                    <Link
                                                        to={`/student/complaint/${complaint._id}`}
                                                        className="block bg-white/5 hover:bg-white/10 rounded-xl p-5 transition-all border border-white/10 hover:border-orange-500/40 hover-lift"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-2">
                                                                    <span className="text-xs font-mono text-gray-400 bg-white/10 px-2 py-1 rounded">
                                                                        {complaint.complaintId}
                                                                    </span>
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${complaint.status === 'pending'
                                                                            ? 'bg-yellow-500/20 text-yellow-300'
                                                                            : complaint.status === 'in-progress'
                                                                                ? 'bg-blue-500/20 text-blue-300'
                                                                                : complaint.status === 'resolved'
                                                                                    ? 'bg-green-500/20 text-green-300'
                                                                                    : 'bg-red-500/20 text-red-300'
                                                                            }`}
                                                                    >
                                                                        {complaint.status.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <h3 className="font-semibold text-white mb-1">{complaint.title}</h3>
                                                                <p className="text-sm text-gray-400 line-clamp-1">{complaint.description}</p>
                                                            </div>
                                                            <div className="text-right ml-4">
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ─── WHEEL VIEW ─────────────────────── */}
                        {view === 'wheel' && (
                            <motion.div
                                key="wheel"
                                className="flex items-center justify-center min-h-[70vh]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <CategoryWheel
                                    onSelectCategory={handleCategorySelect}
                                    onBack={() => setView('dashboard')}
                                />
                            </motion.div>
                        )}

                        {/* ─── FORM VIEW ──────────────────────── */}
                        {view === 'form' && (() => {
                            const catThemes = {
                                Canteen: { icon: '🍽️', colors: ['#FF6B6B', '#EE5A24'], ring: 'focus:ring-red-400', border: 'border-red-200', bg: 'bg-red-50' },
                                Academic: { icon: '📚', colors: ['#4834d4', '#686de0'], ring: 'focus:ring-indigo-400', border: 'border-indigo-200', bg: 'bg-indigo-50' },
                                Maintenance: { icon: '🔧', colors: ['#F79F1F', '#FFC312'], ring: 'focus:ring-amber-400', border: 'border-amber-200', bg: 'bg-amber-50' },
                                Auditorium: { icon: '🎭', colors: ['#8854d0', '#a55eea'], ring: 'focus:ring-purple-400', border: 'border-purple-200', bg: 'bg-purple-50' },
                                Administration: { icon: '🏛️', colors: ['#20bf6b', '#26de81'], ring: 'focus:ring-emerald-400', border: 'border-emerald-200', bg: 'bg-emerald-50' },
                                Sports: { icon: '⚽', colors: ['#FA8231', '#FD9644'], ring: 'focus:ring-orange-400', border: 'border-orange-200', bg: 'bg-orange-50' },
                                Others: { icon: '📋', colors: ['#3867d6', '#4b7bec'], ring: 'focus:ring-blue-400', border: 'border-blue-200', bg: 'bg-blue-50' },
                            };
                            const theme = catThemes[selectedCategory] || catThemes['Others'];
                            const gradient = `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`;

                            return (
                                <motion.div
                                    key="form"
                                    className="max-w-3xl mx-auto"
                                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                                >
                                    <motion.button
                                        onClick={() => setView('wheel')}
                                        className="group flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
                                        whileHover={{ x: -4 }}
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                        Back to Categories
                                    </motion.button>

                                    <motion.div
                                        className="rounded-2xl shadow-2xl overflow-hidden border border-white/10"
                                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {/* Themed gradient header */}
                                        <div className="relative overflow-hidden" style={{ background: gradient }}>
                                            {/* Floating particles in header */}
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                                                    style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                                                    animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
                                                    transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            ))}
                                            <div className="relative z-10 px-8 py-6 flex items-center space-x-4">
                                                <motion.span
                                                    className="text-5xl"
                                                    animate={{ rotate: [0, 8, -8, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                                >
                                                    {theme.icon}
                                                </motion.span>
                                                <div>
                                                    <h1 className="text-2xl font-black text-white tracking-tight">
                                                        {selectedCategory} Complaint
                                                    </h1>
                                                    <p className="text-white/70 text-sm">
                                                        Fill in the details below
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setView('wheel')}
                                                    className="ml-auto px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-medium hover:bg-white/30 transition-colors"
                                                >
                                                    Change ↻
                                                </button>
                                            </div>
                                            {/* Bottom wave decoration */}
                                            <svg viewBox="0 0 600 30" className="w-full block" preserveAspectRatio="none">
                                                <path d="M0,15 C150,30 350,0 600,15 L600,30 L0,30 Z" fill="rgba(0,0,0,0.6)" />
                                            </svg>
                                        </div>

                                        {/* Form body */}
                                        <div className="px-8 pb-8 pt-2">
                                            {formError && (
                                                <motion.div
                                                    className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-5"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                >
                                                    {formError}
                                                </motion.div>
                                            )}

                                            <form onSubmit={handleFormSubmit} className="space-y-5">
                                                {/* Title */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.15 }}
                                                >
                                                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                                                        Title <span style={{ color: theme.colors[0] }}>*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleFormChange}
                                                        className={`w-full px-4 py-3 border rounded-xl ${theme.ring} transition-all bg-white/5 hover:bg-white/10 text-white placeholder-gray-500`}
                                                        style={{ borderColor: `${theme.colors[0]}30` }}
                                                        placeholder="Brief summary of your complaint"
                                                        maxLength={200}
                                                        required
                                                    />
                                                </motion.div>

                                                {/* Description */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                                                        Description <span style={{ color: theme.colors[0] }}>*</span>
                                                    </label>
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleFormChange}
                                                        rows={5}
                                                        className={`w-full px-4 py-3 border rounded-xl ${theme.ring} transition-all bg-white/5 hover:bg-white/10 text-white placeholder-gray-500`}
                                                        style={{ borderColor: `${theme.colors[0]}30` }}
                                                        placeholder="Describe your complaint in detail..."
                                                        maxLength={2000}
                                                        required
                                                    />
                                                    <div className="flex justify-between mt-1">
                                                        <p className="text-xs text-gray-400">Be as detailed as possible</p>
                                                        <p className="text-xs font-mono" style={{ color: theme.colors[0] }}>
                                                            {formData.description.length}/2000
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                {/* Priority — styled chips */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.25 }}
                                                >
                                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                        Priority
                                                    </label>
                                                    <div className="flex space-x-3">
                                                        {['low', 'medium', 'high'].map((p) => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${formData.priority === p
                                                                    ? 'text-white shadow-lg scale-105'
                                                                    : 'bg-white/5 text-gray-300 border-white/20 hover:border-white/40'
                                                                    }`}
                                                                style={formData.priority === p ? { background: gradient, borderColor: theme.colors[0] } : {}}
                                                            >
                                                                {p === 'low' ? '🟢' : p === 'medium' ? '🟡' : '🔴'} {p.charAt(0).toUpperCase() + p.slice(1)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>

                                                {/* Attachments */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                                                        Attachments <span className="text-gray-500 font-normal">(Optional)</span>
                                                    </label>
                                                    <div
                                                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all hover:scale-[1.01]"
                                                        style={{ borderColor: `${theme.colors[0]}40` }}
                                                    >
                                                        <div className="space-y-1 text-center">
                                                            <Upload className="mx-auto h-10 w-10" style={{ color: theme.colors[0] }} />
                                                            <div className="flex text-sm text-gray-400">
                                                                <label className="relative cursor-pointer rounded-md font-semibold transition-colors" style={{ color: theme.colors[0] }}>
                                                                    <span>Upload files</span>
                                                                    <input
                                                                        type="file"
                                                                        multiple
                                                                        onChange={handleFileChange}
                                                                        className="sr-only"
                                                                        accept="image/*,.pdf,.doc,.docx"
                                                                    />
                                                                </label>
                                                            </div>
                                                            <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 5MB</p>
                                                        </div>
                                                    </div>
                                                    {files.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {files.map((f, i) => (
                                                                <span key={i} className={`text-xs px-3 py-1 rounded-full ${theme.bg} font-medium`} style={{ color: theme.colors[0] }}>
                                                                    📎 {f.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>

                                                {/* Anonymous toggle */}
                                                <motion.div
                                                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.35 }}
                                                >
                                                    <div
                                                        onClick={() => setFormData(prev => ({ ...prev, anonymous: !prev.anonymous }))}
                                                        className="relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200"
                                                        style={{ background: formData.anonymous ? gradient : '#d1d5db' }}
                                                    >
                                                        <motion.div
                                                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                                                            animate={{ left: formData.anonymous ? 22 : 2 }}
                                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-300 font-medium">Submit anonymously</span>
                                                </motion.div>

                                                {/* Buttons */}
                                                <div className="flex space-x-4 pt-2">
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setView('wheel')}
                                                        className="flex-1 py-3.5 rounded-xl font-semibold bg-white/10 text-gray-300 hover:bg-white/20 transition-all border border-white/20"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                    <motion.button
                                                        type="submit"
                                                        disabled={formLoading}
                                                        className="flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                        style={{ background: gradient }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        {formLoading ? (
                                                            <span className="flex items-center justify-center">
                                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                                Submitting...
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-center space-x-2">
                                                                <span>Submit Complaint</span>
                                                                <span>→</span>
                                                            </span>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
