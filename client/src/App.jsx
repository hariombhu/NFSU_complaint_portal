import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaints from './pages/TrackComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import ManageComplaints from './pages/ManageComplaints';
import UserManagement from './pages/UserManagement';

const DashboardRedirect = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'student':
            return <Navigate to="/student/dashboard" />;
        case 'department':
            return <Navigate to="/department/dashboard" />;
        case 'admin':
            return <Navigate to="/admin/dashboard" />;
        default:
            return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider children>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Dashboard redirect */}
                    <Route path="/" element={<DashboardRedirect />} />

                    {/* Student routes */}
                    <Route
                        path="/student/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/submit-complaint"
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <SubmitComplaint />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/track-complaints"
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <TrackComplaints />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/complaint/:id"
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <ComplaintDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Department routes */}
                    <Route
                        path="/department/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/manage-complaints"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <ManageComplaints />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/complaint/:id"
                        element={
                            <ProtectedRoute allowedRoles={['department', 'admin']}>
                                <ComplaintDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <UserManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/complaints"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageComplaints />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/complaint/:id"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ComplaintDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
