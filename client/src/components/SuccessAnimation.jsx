import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SuccessAnimation = ({ message = 'Complaint Submitted!', onComplete, delay = 2500 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, delay);
        return () => clearTimeout(timer);
    }, [onComplete, delay]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
            }}
        >
            {/* Confetti-like particles */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 10 + 4,
                        height: Math.random() * 10 + 4,
                        background: [
                            '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
                            '#fbbf24', '#3b82f6', '#8b5cf6', '#f472b6'
                        ][i % 8],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1, 0.5],
                        opacity: [0, 1, 0],
                        y: [0, -(Math.random() * 200 + 50)],
                        x: [(Math.random() - 0.5) * 100],
                    }}
                    transition={{
                        duration: Math.random() * 1.5 + 1,
                        delay: Math.random() * 0.8 + 0.3,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Main tick animation */}
            <motion.div
                className="relative"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
            >
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    className="drop-shadow-2xl"
                >
                    {/* Background glow */}
                    <circle
                        cx="80"
                        cy="80"
                        r="75"
                        fill="none"
                        stroke="#d1fae5"
                        strokeWidth="6"
                        opacity="0.5"
                    />

                    {/* Main circle */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />

                    {/* Fill circle */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="55"
                        fill="#10b981"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        style={{ transformOrigin: '80px 80px' }}
                    />

                    {/* Checkmark */}
                    <motion.path
                        d="M50 80 L72 102 L112 58"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
                    />
                </svg>

                {/* Pulse rings */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-green-300"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ delay: 0.8, duration: 1, repeat: 2 }}
                />
            </motion.div>

            {/* Success message */}
            <motion.h2
                className="text-3xl font-bold text-green-800 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
            >
                {message}
            </motion.h2>

            <motion.p
                className="text-green-600 mt-3 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                Redirecting to dashboard...
            </motion.p>

            {/* Progress bar */}
            <motion.div
                className="mt-6 w-48 h-1.5 bg-green-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: (delay - 800) / 1000, ease: 'linear' }}
                />
            </motion.div>
        </motion.div>
    );
};

export default SuccessAnimation;
