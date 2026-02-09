import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/api';
import { LayoutDashboard, LogOut, Users, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await analyticsService.getDashboard();
            setAnalytics(res.data.analytics);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <LayoutDashboard className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">System Overview</p>
                            </div>
                        </div>
                        <button onClick={logout} className="flex items-center text-gray-600 hover:text-red-600">
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                            <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">{analytics?.overview?.totalComplaints || 0}</p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <Users className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">{analytics?.overview?.totalStudents || 0}</p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Departments</p>
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold">{analytics?.overview?.totalDepartments || 0}</p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Avg Resolution (hrs)</p>
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold">{analytics?.overview?.avgResolutionTime || 0}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Category Stats */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Complaints by Category</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics?.categoryStats || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Status Distribution */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics?.statusStats || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry._id}: ${entry.count}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {(analytics?.statusStats || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Complaints */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(analytics?.recentComplaints || []).map((complaint) => (
                                    <tr key={complaint._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">{complaint.complaintId}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{complaint.title}</td>
                                        <td className="px-4 py-3 text-sm">{complaint.category}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`status-${complaint.status} px-2 py-1 rounded text-xs`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
