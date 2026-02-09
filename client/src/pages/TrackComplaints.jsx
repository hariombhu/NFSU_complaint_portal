import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import { Search, Filter, ArrowLeft } from 'lucide-react';

const TrackComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        filterComplaints();
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

    const filterComplaints = () => {
        let filtered = complaints;

        if (search) {
            filtered = filtered.filter(
                (c) =>
                    c.title.toLowerCase().includes(search.toLowerCase()) ||
                    c.complaintId.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter((c) => c.status === statusFilter);
        }

        setFilteredComplaints(filtered);
    };

    const getStatusBadge = (status) => {
        const classes = {
            pending: 'status-pending',
            'in-progress': 'status-in-progress',
            resolved: 'status-resolved',
            escalated: 'status-escalated',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${classes[status]}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/student/dashboard" className="flex items-center text-gray-600 hover:text-primary-600 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="glass rounded-xl p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Track Complaints</h1>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="escalated">Escalated</option>
                            </select>
                        </div>
                    </div>

                    {/* Complaints List */}
                    {filteredComplaints.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No complaints found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredComplaints.map((complaint) => (
                                <Link
                                    key={complaint._id}
                                    to={`/student/complaint/${complaint._id}`}
                                    className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <span className="text-xs font-mono text-gray-500">{complaint.complaintId}</span>
                                            <h3 className="text-lg font-bold text-gray-900 mt-1">{complaint.title}</h3>
                                        </div>
                                        {getStatusBadge(complaint.status)}
                                    </div>

                                    <p className="text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded">{complaint.category}</span>
                                            <span className={`priority-${complaint.priority} px-2 py-1 rounded`}>
                                                {complaint.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackComplaints;
