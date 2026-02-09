import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import { FileText, Clock, CheckCircle, AlertCircle, PlusCircle, Search, LogOut } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: 'url(/assets/dashboard-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

            {/* Content over background */}
            <div className="relative z-10">
                {/* Header with Logo */}
                <header className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Logo */}
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center p-2">
                                    <img
                                        src="/assets/logo.png"
                                        alt="NFSU Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <span className="text-xl font-bold text-primary-600" style={{ display: 'none' }}>N</span>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                                    <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Link
                            to="/student/submit-complaint"
                            className="group bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <PlusCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Submit Complaint</h3>
                                    <p className="text-blue-100">Register a new complaint</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/student/track-complaints"
                            className="group bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <Search className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Track Complaints</h3>
                                    <p className="text-purple-100">View all your complaints</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-400">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-gray-600">Total Complaints</p>
                                <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-4xl font-bold text-gray-900">{stats?.total || 0}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-400">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-yellow-700">Pending</p>
                                <Clock className="w-6 h-6 text-yellow-500" />
                            </div>
                            <p className="text-4xl font-bold text-yellow-600">{stats?.pending || 0}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-400">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-blue-700">In Progress</p>
                                <AlertCircle className="w-6 h-6 text-blue-500" />
                            </div>
                            <p className="text-4xl font-bold text-blue-600">{stats?.inProgress || 0}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-400">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-green-700">Resolved</p>
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <p className="text-4xl font-bold text-green-600">{stats?.resolved || 0}</p>
                        </div>
                    </div>

                    {/* Recent Complaints */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Complaints</h2>

                        {recentComplaints.length === 0 ? (
                            <div className="text-center py-16">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-4">No complaints yet</p>
                                <Link
                                    to="/student/submit-complaint"
                                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Submit your first complaint
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentComplaints.map((complaint) => (
                                    <Link
                                        key={complaint._id}
                                        to={`/student/complaint/${complaint._id}`}
                                        className="block bg-gray-50 hover:bg-gray-100 rounded-xl p-5 transition-all border border-gray-200 hover:border-primary-300"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                                                        {complaint.complaintId}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${complaint.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : complaint.status === 'in-progress'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : complaint.status === 'resolved'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {complaint.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{complaint.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-1">{complaint.description}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
