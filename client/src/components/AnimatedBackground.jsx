import { motion } from 'framer-motion';
import Particles from './Particles';

/**
 * Animated background with floating orbs, mesh gradient, and subtle grid.
 * Use as a full-screen absolute/fixed layer behind page content.
 *
 * @param {'dark' | 'light'} variant - 'dark' for login/register, 'light' for dashboard
 */
const AnimatedBackground = ({ variant = 'dark' }) => {
    const isDark = variant === 'dark';

    // Orb configuration for visual depth
    const orbs = [
        { size: 350, x: '10%', y: '15%', color: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)', dur: 18 },
        { size: 280, x: '75%', y: '10%', color: isDark ? 'rgba(139,92,246,0.10)' : 'rgba(139,92,246,0.06)', dur: 22 },
        { size: 400, x: '50%', y: '70%', color: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)', dur: 25 },
        { size: 220, x: '85%', y: '80%', color: isDark ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.06)', dur: 20 },
        { size: 300, x: '25%', y: '85%', color: isDark ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.04)', dur: 24 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, #0a0e27 0%, #0f1a3e 40%, #0d1230 70%, #080b1f 100%)'
                        : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 30%, #f0f4ff 60%, #eef2ff 100%)',
                }}
            />

            {/* BASE PARTICLES (CONNECTED WEB) */}
            <Particles
                particleCount={isDark ? 60 : 40}
                particleColor={isDark ? 'rgba(147, 197, 253, 0.15)' : 'rgba(99, 102, 241, 0.12)'}
                lineColor={isDark ? 'rgba(147, 197, 253, 0.05)' : 'rgba(99, 102, 241, 0.08)'}
                speed={0.3}
            />

            {/* Floating gradient orbs */}
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: orb.x,
                        top: orb.y,
                        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                    }}
                    animate={{
                        x: [0, 30 * (i % 2 === 0 ? 1 : -1), -20 * (i % 2 === 0 ? 1 : -1), 0],
                        y: [0, -25, 15, 0],
                        scale: [1, 1.1, 0.95, 1],
                    }}
                    transition={{
                        duration: orb.dur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: isDark
                        ? `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`
                        : `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className="absolute rounded-full"
                    style={{
                        width: 2 + (i % 3),
                        height: 2 + (i % 3),
                        left: `${6 + i * 8}%`,
                        top: `${10 + (i % 5) * 18}%`,
                        background: isDark ? 'rgba(147,197,253,0.25)' : 'rgba(99,102,241,0.2)',
                    }}
                    animate={{
                        y: [0, -(20 + i * 3), 0],
                        x: [0, (i % 2 === 0 ? 12 : -12), 0],
                        opacity: [0.15, 0.5, 0.15],
                    }}
                    transition={{
                        duration: 5 + i * 0.7,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Diagonal accent line */}
            <motion.div
                className="absolute"
                style={{
                    width: '150%',
                    height: 1,
                    left: '-25%',
                    top: '40%',
                    background: isDark
                        ? 'linear-gradient(90deg, transparent, rgba(99,102,241,0.08), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.06), transparent)',
                    transform: 'rotate(-15deg)',
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Top-right corner glow */}
            <div
                className="absolute -top-32 -right-32 rounded-full"
                style={{
                    width: 400,
                    height: 400,
                    background: isDark
                        ? 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)'
                        : 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 60%)',
                }}
            />
        </div>
    );
};

export default AnimatedBackground;
