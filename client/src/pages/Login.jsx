import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Particles from '../components/Particles';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Splash animation phases: 'pop' → 'glow' → 'settle' → 'ready'
    const [phase, setPhase] = useState(() => {
        return sessionStorage.getItem('hasSeenSplash') ? 'ready' : 'pop';
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    // Orchestrate the splash timeline
    useEffect(() => {
        if (sessionStorage.getItem('hasSeenSplash')) return;

        const timers = [];
        // Phase 1: logo pops in from corner (immediate)
        // Phase 2: pulse/glow effect  → after 1.2s
        timers.push(setTimeout(() => setPhase('glow'), 1200));
        // Phase 3: logo settles as background → after 2.8s
        timers.push(setTimeout(() => {
            setPhase('settle');
            sessionStorage.setItem('hasSeenSplash', 'true');
        }, 2800));
        // Phase 4: login form appears → after 3.6s
        timers.push(setTimeout(() => setPhase('ready'), 3600));
        return () => timers.forEach(clearTimeout);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            if (result.user.role === 'student') {
                sessionStorage.setItem('showLetterAnimation', 'true');
            }
            setIsExiting(true);
            const roleRoutes = {
                student: '/student/dashboard',
                department: '/department/dashboard',
                admin: '/admin/dashboard',
            };
            setTimeout(() => navigate(roleRoutes[result.user.role] || '/'), 600);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    const showForm = phase === 'ready' || phase === 'settle';
    const isSplash = phase === 'pop' || phase === 'glow';

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* ── PHASE 1 & 2: SPLASH LOGO ────────────────── */}
            <AnimatePresence>
                {isSplash && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #0a0e27, #0f1a3e)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Radial glow behind logo */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: 500,
                                height: 500,
                                background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={phase === 'glow'
                                ? { scale: [1, 1.4, 1.2], opacity: [0.5, 1, 0.7] }
                                : { scale: 0.5, opacity: 0.3 }
                            }
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />

                        {/* Orbiting light dots */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                                initial={{ opacity: 0 }}
                                animate={phase === 'glow' ? {
                                    opacity: [0, 0.8, 0],
                                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 180],
                                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 180],
                                } : { opacity: 0 }}
                                transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
                            />
                        ))}

                        {/* Logo — pops from bottom-right corner */}
                        <motion.img
                            src="/assets/portal_logo.jpeg"
                            alt="UniResolve"
                            className="relative z-10 rounded-full shadow-2xl object-cover border-4 border-white/10"
                            initial={{
                                x: '60vw',
                                y: '60vh',
                                scale: 0.1,
                                opacity: 0,
                                rotate: 15,
                            }}
                            animate={phase === 'pop'
                                ? { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }
                                : { x: 0, y: 0, scale: 1.05, opacity: 1, rotate: 0 }
                            }
                            transition={phase === 'pop'
                                ? { duration: 1, type: 'spring', stiffness: 80, damping: 15 }
                                : { duration: 0.6, ease: 'easeInOut' }
                            }
                            style={{ width: 260, height: 260 }}
                        />

                        {/* Text under logo during glow phase */}
                        <motion.div
                            className="absolute bottom-[22%] text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={phase === 'glow' ? { opacity: 1, y: 0 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h1 className="text-3xl font-black text-white tracking-widest">
                                UniResolve
                            </h1>
                            <p className="text-blue-300/60 text-sm mt-1 tracking-wider">
                                NFSU Complaint Portal
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── ANIMATED BACKGROUND ────── */}
            <AnimatedBackground variant="dark" />

            {/* ── 3D PARTICLES LAYER ────── */}
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

            {/* Wavering logo in background — appears after settle */}
            <AnimatePresence>
                {(phase === 'settle' || phase === 'ready') && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.img
                            src="/assets/portal_logo.jpeg"
                            alt=""
                            className="rounded-full"
                            style={{
                                width: 400,
                                height: 400,
                                opacity: 0.15,
                                filter: 'blur(0.5px) brightness(0.8)',
                            }}
                            animate={{
                                // Wind-waver effect: combines gentle rotate, scale breathing, and x/y drift
                                rotate: [0, 4, -3, 2.5, -4, 0],
                                x: [0, 18, -12, 15, -18, 0],
                                y: [0, -10, 14, -8, 12, 0],
                                scale: [1, 1.04, 0.96, 1.03, 0.97, 1],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>



            {/* ── LOGIN FORM CONTENT ─────────────────────── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="relative z-10 min-h-screen flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.05 : 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="max-w-md w-full"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            {/* Header — logo badge + title */}
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
                                    NFSU Complaint Portal
                                </h1>
                                <p className="text-blue-300/50 text-sm tracking-wide">
                                    National Forensic Sciences University
                                </p>
                            </motion.div>

                            {/* Login Card */}
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
                                    Login to Your Account
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

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-blue-200/70 mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all outline-none"
                                            placeholder="your.email@nfsu.ac.in"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="block text-sm font-medium text-blue-200/70 mb-1.5">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </motion.div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50"
                                        style={{
                                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                        }}
                                        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(59,130,246,0.4)' }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Logging in...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center space-x-2">
                                                <LogIn className="w-5 h-5" />
                                                <span>Login</span>
                                            </span>
                                        )}
                                    </motion.button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-white/40 text-sm">
                                        New student?{' '}
                                        <Link
                                            to="/register"
                                            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                        >
                                            Register here
                                        </Link>
                                    </p>
                                </div>

                                {/* Sample credentials */}
                                <motion.div
                                    className="mt-5 p-3 bg-white/5 border border-white/10 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <p className="text-xs font-semibold text-blue-300/60 mb-1.5">
                                        Sample Credentials:
                                    </p>
                                    <div className="text-xs text-white/30 space-y-0.5 font-mono">
                                        <p>Admin: admin@nfsu.ac.in / admin123</p>
                                        <p>Dept: canteen@nfsu.ac.in / canteen123</p>
                                        <p>Student: rahul.sharma@nfsu.ac.in / student123</p>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <p className="text-center text-white/20 mt-6 text-xs">
                                © 2024 National Forensic Sciences University
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
