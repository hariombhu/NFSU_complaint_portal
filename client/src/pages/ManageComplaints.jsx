import { useState, useEffect } from 'react';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageComplaints = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', remarks: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await complaintService.getAll();
            setComplaints(res.data.complaints);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await complaintService.updateStatus(selectedComplaint._id, statusUpdate);
            fetchComplaints();
            setSelectedComplaint(null);
            setStatusUpdate({ status: '', remarks: '' });
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

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Manage Complaints</h1>

                <div className="glass rounded-xl p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Title</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((complaint) => (
                                    <tr key={complaint._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-mono">{complaint.complaintId}</td>
                                        <td className="px-4 py-3">{complaint.title}</td>
                                        <td className="px-4 py-3">
                                            <span className={`status-${complaint.status} px-2 py-1 rounded text-xs`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedComplaint(complaint)}
                                                className="text-primary-600 hover:underline text-sm"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedComplaint && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4">Update Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Status</label>
                                    <select
                                        value={statusUpdate.status}
                                        onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Select status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="escalated">Escalated</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Remarks</label>
                                    <textarea
                                        value={statusUpdate.remarks}
                                        onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setSelectedComplaint(null)}
                                        className="flex-1 bg-gray-200 py-2 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateStatus}
                                        className="flex-1 bg-primary-600 text-white py-2 rounded-lg"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageComplaints;
