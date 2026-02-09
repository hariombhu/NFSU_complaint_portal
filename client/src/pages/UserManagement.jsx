import { useState, useEffect } from 'react';
import { userService } from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        studentId: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data.users);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.create(formData);
            fetchUsers();
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'student', department: '', studentId: '' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Add User
                    </button>
                </div>

                <div className="glass rounded-xl p-6">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{user.department || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="student">Student</option>
                                    <option value="department">Department</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {formData.role === 'department' && (
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Canteen">Canteen</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Auditorium">Auditorium</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Others">Others</option>
                                    </select>
                                )}
                                <div className="flex space-x-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg">
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
