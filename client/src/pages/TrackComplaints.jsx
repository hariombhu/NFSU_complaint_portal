import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, FileText, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Hyperspeed from '../components/Hyperspeed';
import { hyperspeedPresets } from '../components/HyperSpeedPresets';

const STATUS_STYLES = {
    pending: { cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock, label: 'PENDING' },
    'in-progress': { cls: 'bg-blue-500/20   text-blue-300   border-blue-500/30', icon: AlertCircle, label: 'IN PROGRESS' },
    resolved: { cls: 'bg-green-500/20  text-green-300  border-green-500/30', icon: CheckCircle, label: 'RESOLVED' },
    escalated: { cls: 'bg-red-500/20    text-red-300    border-red-500/30', icon: XCircle, label: 'ESCALATED' },
    'on-hold': { cls: 'bg-gray-500/20   text-gray-300   border-gray-500/30', icon: Clock, label: 'ON HOLD' },
};

const PRIORITY_STYLES = {
    low: 'text-green-400 bg-green-500/10 border border-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
    high: 'text-red-400 bg-red-500/10 border border-red-500/20',
};

const CATEGORY_ICONS = {
    Canteen: '🍽️', Academic: '📚', Maintenance: '🔧',
    Auditorium: '🎭', Administration: '🏛️', Sports: '⚽', Others: '📋',
};

const TrackComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchComplaints(); }, []);

    useEffect(() => {
        let filtered = complaints;
        if (search) filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.complaintId.toLowerCase().includes(search.toLowerCase())
        );
        if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);
        setFilteredComplaints(filtered);
    }, [search, statusFilter, complaints]);

    const fetchComplaints = async () => {
        try {
            const res = await complaintService.getAll();
            setComplaints(res.data.complaints);
            setFilteredComplaints(res.data.complaints);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* ── Hyperspeed background ── */}
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
                            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-orange-500 animate-spin" />
                            <p className="mt-4 text-white/70 font-medium animate-pulse">Loading complaints…</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <div className="relative z-10 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

                    {/* Back link */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            to="/student/dashboard"
                            className="inline-flex items-center text-white/50 hover:text-orange-400 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                    </motion.div>

                    {/* Page header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-4xl font-black text-white tracking-tight">Track Complaints</h1>
                        <p className="text-white/40 mt-1">
                            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search by title or ID…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/30 transition-all backdrop-blur-md"
                            />
                        </div>

                        {/* Status filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/30 transition-all backdrop-blur-md appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-gray-900">All Status</option>
                                <option value="pending" className="bg-gray-900">Pending</option>
                                <option value="in-progress" className="bg-gray-900">In Progress</option>
                                <option value="resolved" className="bg-gray-900">Resolved</option>
                                <option value="escalated" className="bg-gray-900">Escalated</option>
                                <option value="on-hold" className="bg-gray-900">On Hold</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Complaints list */}
                    <AnimatePresence mode="wait">
                        {filteredComplaints.length === 0 ? (
                            <motion.div
                                key="empty"
                                className="flex flex-col items-center justify-center py-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <FileText className="w-16 h-16 text-white/15 mb-4" />
                                <p className="text-white/40 text-xl font-semibold">No complaints found</p>
                                <p className="text-white/25 text-sm mt-1">
                                    {search || statusFilter ? 'Try adjusting your filters' : 'Submit your first complaint from the dashboard'}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                className="space-y-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {filteredComplaints.map((complaint, index) => {
                                    const statusInfo = STATUS_STYLES[complaint.status] || STATUS_STYLES['pending'];
                                    const StatusIcon = statusInfo.icon;
                                    const catIcon = CATEGORY_ICONS[complaint.category] || '📋';

                                    return (
                                        <motion.div
                                            key={complaint._id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.04 * index }}
                                        >
                                            <Link
                                                to={`/student/complaint/${complaint._id}`}
                                                className="group block bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-orange-500/40 hover:bg-white/5 transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    {/* Left */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Top row */}
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                                                                {complaint.complaintId}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusInfo.cls}`}>
                                                                <StatusIcon className="w-3 h-3" />
                                                                {statusInfo.label}
                                                            </span>
                                                            {complaint.priority && (
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLES[complaint.priority]}`}>
                                                                    {complaint.priority === 'high' ? '🔴' : complaint.priority === 'medium' ? '🟡' : '🟢'} {complaint.priority.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-white font-bold text-base truncate group-hover:text-orange-300 transition-colors">
                                                            {catIcon} {complaint.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-white/40 text-sm mt-1 line-clamp-1">
                                                            {complaint.description}
                                                        </p>

                                                        {/* Bottom metadata */}
                                                        <div className="flex items-center gap-3 mt-3">
                                                            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded">
                                                                {complaint.category}
                                                            </span>
                                                            <span className="text-xs text-white/30">
                                                                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Arrow */}
                                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-orange-400/70 transition-colors flex-shrink-0 mt-1" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TrackComplaints;
