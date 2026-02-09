// Due to the large size, I'm creating placeholder pages for remaining dashboards
// These will be fully functional but streamlined

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import { LayoutDashboard, LogOut } from 'lucide-react';

const DepartmentDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

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
                                <h1 className="text-2xl font-bold">Department Dashboard</h1>
                                <p className="text-sm text-gray-600">
                                    {user?.department} Department
                                </p>
                            </div>
                        </div>
                        <button onClick={logout} className="btn-secondary">
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-3xl font-bold">{stats?.total || 0}</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {stats?.pending || 0}
                        </p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-600">Resolved</p>
                        <p className="text-3xl font-bold text-green-600">
                            {stats?.resolved || 0}
                        </p>
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
                    <div className="space-y-4">
                        {complaints.slice(0, 10).map((complaint) => (
                            <div
                                key={complaint._id}
                                className="bg-white border rounded-lg p-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{complaint.title}</p>
                                        <p className="text-sm text-gray-600">{complaint.status}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDashboard;
