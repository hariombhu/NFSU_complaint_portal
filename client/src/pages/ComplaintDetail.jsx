import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, User, Tag, Star } from 'lucide-react';

const ComplaintDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await complaintService.getById(id);
            setComplaint(res.data.complaint);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = async () => {
        try {
            await complaintService.submitFeedback(id, feedback);
            fetchComplaint();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Complaint not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary-600 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="glass rounded-xl p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <span className="text-sm font-mono text-gray-500">{complaint.complaintId}</span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">{complaint.title}</h1>
                        </div>
                        <span className={`status-${complaint.status} px-4 py-2 rounded-full text-sm font-medium border`}>
                            {complaint.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center">
                            <Tag className="w-5 h-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="font-medium">{complaint.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500">Created</p>
                                <p className="font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500">Priority</p>
                                <p className={`priority-${complaint.priority} font-medium px-2 py-1 rounded`}>
                                    {complaint.priority.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Tag className="w-5 h-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="font-medium">{complaint.assignedDepartment}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
                    </div>

                    {complaint.resolutionRemarks && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <h3 className="font-bold text-green-900 mb-2">Resolution Remarks</h3>
                            <p className="text-green-800">{complaint.resolutionRemarks}</p>
                        </div>
                    )}

                    {complaint.status === 'resolved' && !complaint.feedback && user.role === 'student' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="font-bold text-blue-900 mb-4">Rate this resolution</h3>
                            <div className="flex items-center space-x-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-8 h-8 cursor-pointer ${star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                        onClick={() => setFeedback({ ...feedback, rating: star })}
                                    />
                                ))}
                            </div>
                            <textarea
                                value={feedback.comment}
                                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                                placeholder="Add your feedback (optional)"
                                className="w-full px-4 py-3 border rounded-lg mb-4"
                                rows={3}
                            />
                            <button
                                onClick={handleFeedback}
                                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    )}

                    {complaint.feedback && (
                        <div className="bg-gray-50 border rounded-lg p-4">
                            <h3 className="font-bold mb-2">Feedback Provided</h3>
                            <div className="flex items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= complaint.feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            {complaint.feedback.comment && <p className="text-gray-700">{complaint.feedback.comment}</p>}
                        </div>
                    )}
                </div>

                {/* Status History */}
                {complaint.statusHistory && complaint.statusHistory.length > 0 && (
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Status History</h2>
                        <div className="space-y-4">
                            {complaint.statusHistory.map((history, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="w-3 h-3 bg-primary-600 rounded-full mt-1 mr-3"></div>
                                    <div>
                                        <p className="font-medium">{history.status.toUpperCase()}</p>
                                        <p className="text-sm text-gray-600">{new Date(history.changedAt).toLocaleString()}</p>
                                        {history.remarks && <p className="text-sm text-gray-700 mt-1">{history.remarks}</p>}
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

export default ComplaintDetail;
