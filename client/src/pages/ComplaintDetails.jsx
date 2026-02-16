import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
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
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            'in-progress': 'bg-blue-100 text-blue-700 border-blue-300',
            'on-hold': 'bg-orange-100 text-orange-700 border-orange-300',
            'resolved': 'bg-green-100 text-green-700 border-green-300',
            'escalated': 'bg-red-100 text-red-700 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': 'bg-gray-100 text-gray-700',
            'medium': 'bg-yellow-100 text-yellow-700',
            'high': 'bg-red-100 text-red-700',
        };
        return colors[priority] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-700">{error || 'Complaint not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary-600 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
                </div>

                {/* Complaint ID and Status */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Complaint ID</p>
                            <p className="text-2xl font-bold text-gray-900">{complaint.complaintId}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status.toUpperCase()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 flex items-center">
                                <Tag className="w-4 h-4 mr-2" />
                                Category
                            </p>
                            <p className="font-semibold text-gray-900">{complaint.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Priority
                            </p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Submitted On
                            </p>
                            <p className="font-semibold text-gray-900">
                                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Student Information */}
                {!complaint.anonymous && complaint.studentId && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Student Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-semibold text-gray-900">{complaint.studentId.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold text-gray-900">{complaint.studentId.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Student ID</p>
                                <p className="font-semibold text-gray-900">{complaint.studentId.studentId}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Complaint Details */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Complaint Details
                    </h2>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Title</p>
                        <p className="text-lg font-semibold text-gray-900">{complaint.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Description</p>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
                    </div>
                </div>

                {/* Attachments */}
                {complaint.attachments && complaint.attachments.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Attachments</h2>
                        <div className="space-y-3">
                            {complaint.attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-6 h-6 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{file.originalName}</p>
                                            <p className="text-sm text-gray-500">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:5000/${file.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status Update Actions */}
                {(user.role === 'admin' || user.role === 'department') && complaint.status !== 'resolved' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Remarks / Notes
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter remarks or notes about the status update..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {complaint.status !== 'on-hold' && (
                                <button
                                    onClick={() => handleStatusUpdate('on-hold')}
                                    disabled={updating}
                                    className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                    <Clock className="w-5 h-5 mr-2" />
                                    Mark as On Hold
                                </button>
                            )}

                            <button
                                onClick={() => handleStatusUpdate('resolved')}
                                disabled={updating}
                                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Mark as Resolved
                            </button>
                        </div>
                    </div>
                )}

                {/* Status History */}
                {complaint.statusHistory && complaint.statusHistory.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Status History</h2>
                        <div className="space-y-4">
                            {complaint.statusHistory.map((history, index) => (
                                <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                                    <div className={`p-2 rounded-full ${getStatusColor(history.status)}`}>
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            Status changed to: {history.status.toUpperCase()}
                                        </p>
                                        {history.remarks && (
                                            <p className="text-gray-600 text-sm mt-1">{history.remarks}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(history.changedAt).toLocaleString('en-IN')}
                                            {history.changedBy && ` • ${history.changedBy.name}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintDetails;
