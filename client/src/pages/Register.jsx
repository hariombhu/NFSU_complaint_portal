import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Particles from '../components/Particles';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        studentId: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!formData.email.endsWith('@nfsu.ac.in')) {
            setError('Please use your university email (@nfsu.ac.in)');
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            studentId: formData.studentId,
        });

        if (result.success) {
            navigate('/student/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const fields = [
        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
        { label: 'Student ID', name: 'studentId', type: 'text', placeholder: 'NFSU2024XXX' },
        { label: 'University Email', name: 'email', type: 'email', placeholder: 'your.name@nfsu.ac.in' },
        { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••' },
    ];

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Animated background */}
            <AnimatedBackground variant="dark" />

            {/* 3D Particles layer */}
            <div className="absolute inset-0 z-[1]">
                <Particles
                    particleCount={300}
                    particleSpread={4}
                    speed={0.22}
                    particleColors={["#ffffff"]}
                    moveParticlesOnHover
                    particleHoverFactor={1}
                    alphaParticles={false}
                    particleBaseSize={100}
                    sizeRandomness={1}
                    cameraDistance={20}
                    disableRotation={false}
                />
            </div>

            {/* Wavering logo in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
                <motion.img
                    src="/assets/portal_logo.jpeg"
                    alt=""
                    className="rounded-full"
                    style={{
                        width: 380,
                        height: 380,
                        opacity: 0.06,
                        filter: 'blur(1px) brightness(0.6)',
                    }}
                    animate={{
                        rotate: [0, 3, -2, 1.5, -3, 0],
                        x: [0, 12, -8, 10, -12, 0],
                        y: [0, -6, 8, -4, 7, 0],
                        scale: [1, 1.03, 0.97, 1.02, 0.98, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    className="max-w-md w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Header */}
                    <motion.div
                        className="flex flex-col items-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <motion.div
                            className="w-20 h-20 rounded-full overflow-hidden shadow-xl mb-4 border-2 border-white/10"
                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src="/assets/portal_logo.jpeg"
                                alt="UniResolve"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                            Student Registration
                        </h1>
                        <p className="text-blue-300/50 text-sm tracking-wide">
                            National Forensic Sciences University
                        </p>
                    </motion.div>

                    {/* Registration Card */}
                    <motion.div
                        className="rounded-2xl p-8 shadow-2xl border border-white/10"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(24px)',
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <h2 className="text-xl font-bold text-white/90 mb-6 text-center">
                            Create Account
                        </h2>

                        {error && (
                            <motion.div
                                className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: 'spring' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map((field, i) => (
                                <motion.div
                                    key={field.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 + i * 0.07 }}
                                >
                                    <label className="block text-sm font-medium text-blue-200/70 mb-1.5">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all outline-none"
                                        placeholder={field.placeholder}
                                        required
                                    />
                                </motion.div>
                            ))}

                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 mt-2"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(59,130,246,0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center space-x-2">
                                        <UserPlus className="w-5 h-5" />
                                        <span>Register</span>
                                    </span>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-white/40 text-sm">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    <p className="text-center text-white/20 mt-6 text-xs">
                        © 2024 National Forensic Sciences University
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
