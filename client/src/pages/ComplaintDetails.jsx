import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import Hyperspeed from '../components/Hyperspeed';
import { hyperspeedPresets } from '../components/HyperSpeedPresets';
import {
    ArrowLeft, Calendar, User, FileText, Tag, AlertCircle,
    Download, CheckCircle, Clock, XCircle
} from 'lucide-react';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await complaintService.getById(id);
            setComplaint(res.data.complaint);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load complaint details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!remarks.trim() && (newStatus === 'resolved' || newStatus === 'on-hold')) {
            alert('Please provide remarks before updating status');
            return;
        }

        setUpdating(true);
        try {
            await complaintService.updateStatus(id, {
                status: newStatus,
                remarks: remarks.trim(),
            });
            alert(`Complaint marked as ${newStatus}!`);
            setRemarks('');
            await fetchComplaint();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'on-hold': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'resolved': 'bg-green-500/20 text-green-400 border-green-500/30',
            'escalated': 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': 'text-gray-400 bg-gray-400/10',
            'medium': 'text-yellow-400 bg-yellow-400/10',
            'high': 'text-red-400 bg-red-400/10',
        };
        return colors[priority] || 'text-gray-400 bg-gray-400/10';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                    <Hyperspeed effectOptions={hyperspeedPresets.six} />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400 animate-pulse">Loading details...</p>
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                    <Hyperspeed effectOptions={hyperspeedPresets.six} />
                </div>
                <div className="relative z-10 text-center bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-200">{error || 'Complaint not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
            {/* Hyperspeed background */}
            <div className="fixed inset-0 z-0">
                <Hyperspeed effectOptions={hyperspeedPresets.six} />
            </div>

            {/* Dark overlay for readability */}
            <div className="fixed inset-0 bg-black/50 z-[1]" />

            <div className="relative z-10 py-12 px-4 h-full overflow-y-auto">
                <motion.div
                    className="max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div className="mb-8" variants={itemVariants}>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Complaint <span className="text-orange-500">Details</span>
                        </h1>
                    </motion.div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 gap-6">

                        {/* ID and Status Card */}
                        <motion.div
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                            variants={itemVariants}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Complaint ID</p>
                                    <p className="text-3xl font-black text-white">{complaint.complaintId}</p>
                                </div>
                                <div className={`px-6 py-2 rounded-xl border-2 font-bold tracking-wide text-sm ${getStatusColor(complaint.status)}`}>
                                    {complaint.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                        <Tag className="w-3 h-3 mr-2" />
                                        Category
                                    </p>
                                    <p className="text-lg font-bold text-white">{complaint.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-2" />
                                        Priority
                                    </p>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase ${getPriorityColor(complaint.priority)}`}>
                                        {complaint.priority}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                        <Calendar className="w-3 h-3 mr-2" />
                                        Submitted On
                                    </p>
                                    <p className="text-lg font-bold text-white">
                                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Student Information - Only for non-anonymous */}
                        {!complaint.anonymous && (
                            <motion.div
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                                variants={itemVariants}
                            >
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <User className="w-5 h-5 mr-3 text-orange-500" />
                                    Student Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Name</p>
                                        <p className="text-lg font-bold text-white">{complaint.studentId?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-lg font-bold text-white truncate">{complaint.studentId?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Student ID</p>
                                        <p className="text-lg font-bold text-white">{complaint.studentId?.studentId || 'N/A'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Complaint Details Card */}
                        <motion.div
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                            variants={itemVariants}
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <FileText className="w-5 h-5 mr-3 text-orange-500" />
                                Complaint Content
                            </h2>
                            <div className="mb-6 pb-6 border-b border-white/5">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</p>
                                <p className="text-2xl font-bold text-white">{complaint.title}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Description</p>
                                <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {complaint.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Attachments Card */}
                        {complaint.attachments && complaint.attachments.length > 0 && (
                            <motion.div
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                                variants={itemVariants}
                            >
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <Download className="w-5 h-5 mr-3 text-orange-500" />
                                    Attachments
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {complaint.attachments.map((file, index) => {
                                        // Normalize path: multer may store full OS path or relative path
                                        // Extract just the filename in case it's a full path like uploads\file.jpg
                                        const rawPath = file.path || file.filename || '';
                                        const fileName = rawPath.replace(/\\/g, '/').split('/uploads/').pop() || rawPath.split('/').pop() || rawPath;
                                        const fileUrl = `/uploads/${fileName}`;
                                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalName || fileName);

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group gap-3"
                                            >
                                                {/* Image preview */}
                                                {isImage && (
                                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={fileUrl}
                                                            alt={file.originalName}
                                                            className="w-full max-h-48 object-cover rounded-lg border border-white/10"
                                                            onError={e => { e.target.style.display = 'none'; }}
                                                        />
                                                    </a>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-6 h-6 text-orange-500" />
                                                        </div>
                                                        <div className="max-w-[150px] md:max-w-xs">
                                                            <p className="font-bold text-white truncate text-sm">{file.originalName || fileName}</p>
                                                            <p className="text-xs text-gray-500 font-bold">
                                                                {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'File'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download={file.originalName || fileName}
                                                        className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex-shrink-0"
                                                        title="Download / View Attachment"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Status Update Actions - For Staff/Admin */}
                        {(user.role === 'admin' || user.role === 'department') && complaint.status !== 'resolved' && (
                            <motion.div
                                className="bg-orange-500/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 shadow-2xl"
                                variants={itemVariants}
                            >
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <Clock className="w-5 h-5 mr-3 text-orange-500" />
                                    Action Center
                                </h2>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                        Official Remarks / Resolutions
                                    </label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        rows="4"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none"
                                        placeholder="Enter detailed remarks for the student..."
                                    />
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {complaint.status !== 'on-hold' && (
                                        <button
                                            onClick={() => handleStatusUpdate('on-hold')}
                                            disabled={updating}
                                            className="flex items-center px-8 py-3 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-xl transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                                        >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Set on Hold
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleStatusUpdate('resolved')}
                                        disabled={updating}
                                        className="flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-green-900/20 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Resolve Complaint
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Status History Timeline */}
                        {complaint.statusHistory && complaint.statusHistory.length > 0 && (
                            <motion.div
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                                variants={itemVariants}
                            >
                                <h2 className="text-xl font-bold text-white mb-8 flex items-center">
                                    <Clock className="w-5 h-5 mr-3 text-orange-500" />
                                    Timeline
                                </h2>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                                    {complaint.statusHistory.map((history, index) => (
                                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            {/* Dot */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                <div className={`w-3 h-3 rounded-full ${history.status === 'resolved' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}></div>
                                            </div>
                                            {/* Card */}
                                            <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded bg-black/40 ${getStatusColor(history.status).split(' ')[1]}`}>
                                                        {history.status.replace('-', ' ')}
                                                    </span>
                                                    <time className="text-[10px] font-bold text-gray-500">
                                                        {new Date(history.changedAt).toLocaleString('en-IN', {
                                                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </time>
                                                </div>
                                                {history.remarks && (
                                                    <p className="text-sm text-gray-300 italic mb-2">"{history.remarks}"</p>
                                                )}
                                                <p className="text-[10px] font-bold text-gray-500 flex items-center justify-end">
                                                    <User className="w-3 h-3 mr-1" />
                                                    {history.changedBy?.name || 'System'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
