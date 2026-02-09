import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on role
            const roleRoutes = {
                student: '/student/dashboard',
                department: '/department/dashboard',
                admin: '/admin/dashboard',
            };
            navigate(roleRoutes[result.user.role] || '/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-nfsu-blue via-primary-500 to-nfsu-dark flex items-center justify-center p-4"
            style={{
                backgroundImage: 'url(/assets/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay'
            }}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMThjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xL7k5IDQtNCA0LTQtMS43OS00LTR6bTE4IDE4YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSAzLTQgMy00LTEuNzktNC00em0wLTE4YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSAzLTQgMy00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

            <div className="max-w-4xl w-full relative z-10 animate-fade-in">
                {/* Logo and College Name Header */}
                <div className="flex items-center justify-center mb-8 space-x-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-3 shadow-xl">
                        <img
                            src="/assets/logo.png"
                            alt="NFSU Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <span className="text-4xl font-bold text-white" style={{ display: 'none' }}>N</span>
                    </div>
                    <div className="text-left">
                        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                            NFSU Complaint Portal
                        </h1>
                        <p className="text-xl text-white font-medium drop-shadow-md">
                            National Forensic Sciences University
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Login to Your Account
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="your.email@nfsu.ac.in"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            New student?{' '}
                            <Link
                                to="/register"
                                className="text-primary-600 hover:text-primary-700 font-semibold"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>

                    {/* Sample credentials */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 mb-2">
                            Sample Credentials:
                        </p>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p>Admin: admin@nfsu.ac.in / admin123</p>
                            <p>Department: canteen@nfsu.ac.in / canteen123</p>
                            <p>Student: rahul.sharma@nfsu.ac.in / student123</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-blue-100 mt-6 text-sm">
                    © 2024 National Forensic Sciences University
                </p>
            </div>
        </div>
    );
};

export default Login;
