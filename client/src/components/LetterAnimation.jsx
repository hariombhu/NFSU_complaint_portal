import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LetterAnimation = ({ userName, onComplete }) => {
    const [phase, setPhase] = useState('envelope'); // envelope → opening → letter → done
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase('opening'), 1200),
            setTimeout(() => setPhase('letter'), 1800),
            setTimeout(() => {
                setVisible(false);
                setTimeout(() => onComplete?.(), 500);
            }, 3500),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const handleClick = () => {
        setVisible(false);
        setTimeout(() => onComplete?.(), 400);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
                    onClick={handleClick}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #3b82f6 100%)',
                    }}
                >
                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: Math.random() * 6 + 2,
                                height: Math.random() * 6 + 2,
                                background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}

                    {/* Envelope container */}
                    <motion.div
                        className="relative"
                        initial={{ scale: 0.3, y: 100, rotate: -10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                        transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
                    >
                        {/* Envelope SVG */}
                        <svg
                            width="320"
                            height="220"
                            viewBox="0 0 320 220"
                            className="drop-shadow-2xl"
                        >
                            {/* Envelope body */}
                            <rect
                                x="10"
                                y="60"
                                width="300"
                                height="150"
                                rx="8"
                                fill="#f8fafc"
                                stroke="#e2e8f0"
                                strokeWidth="2"
                            />

                            {/* Envelope bottom fold lines */}
                            <path
                                d="M10 60 L160 150 L310 60"
                                fill="none"
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                            />

                            {/* Envelope flap */}
                            <motion.path
                                d="M10 60 L160 0 L310 60 Z"
                                fill="#e2e8f0"
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                                style={{ transformOrigin: '160px 60px' }}
                                animate={
                                    phase === 'opening' || phase === 'letter'
                                        ? { rotateX: 180, opacity: 0.3 }
                                        : {}
                                }
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                            />

                            {/* Seal */}
                            {phase === 'envelope' && (
                                <motion.circle
                                    cx="160"
                                    cy="40"
                                    r="15"
                                    fill="#ef4444"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}

                            {/* NFSU text on seal */}
                            {phase === 'envelope' && (
                                <text
                                    x="160"
                                    y="44"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    NFSU
                                </text>
                            )}
                        </svg>

                        {/* Letter sliding up */}
                        <AnimatePresence>
                            {(phase === 'letter') && (
                                <motion.div
                                    className="absolute left-1/2 top-[60px]"
                                    initial={{ y: 0, x: '-50%', opacity: 0 }}
                                    animate={{ y: -180, x: '-50%', opacity: 1 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                >
                                    <div className="bg-white rounded-lg shadow-2xl p-8 w-[260px] border border-gray-100">
                                        {/* Letter header decoration */}
                                        <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-4" />

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                        >
                                            <p className="text-gray-400 text-xs mb-2 font-medium tracking-wider uppercase">
                                                NFSU Complaint Portal
                                            </p>
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                Welcome! 👋
                                            </h2>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {userName || 'Student'}
                                            </p>
                                            <div className="mt-3 w-8 h-0.5 bg-blue-200 rounded" />
                                            <p className="text-xs text-gray-400 mt-3">
                                                Your voice matters
                                            </p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Click to continue hint */}
                    <motion.p
                        className="absolute bottom-12 text-white/60 text-sm"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Click anywhere to continue
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LetterAnimation;
