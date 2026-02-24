import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    {
        name: 'Canteen',
        icon: '🍽️',
        colors: ['#FF6B6B', '#EE5A24'],
        accent: '#ff4757',
        tagline: 'Food & Beverages',
        transition: { type: 'spring', stiffness: 300, damping: 20 },
        exitAnim: { scale: [1, 1.3, 0], rotate: 45, opacity: 0 },
    },
    {
        name: 'Academic',
        icon: '📚',
        colors: ['#4834d4', '#686de0'],
        accent: '#5352ed',
        tagline: 'Courses & Faculty',
        transition: { type: 'spring', stiffness: 100, damping: 15 },
        exitAnim: { y: -300, rotateX: 90, opacity: 0 },
    },
    {
        name: 'Maintenance',
        icon: '🔧',
        colors: ['#F79F1F', '#FFC312'],
        accent: '#f0932b',
        tagline: 'Repairs & Upkeep',
        transition: { type: 'tween', duration: 0.6, ease: [0.68, -0.55, 0.27, 1.55] },
        exitAnim: { x: 300, skewX: 30, opacity: 0 },
    },
    {
        name: 'Auditorium',
        icon: '🎭',
        colors: ['#8854d0', '#a55eea'],
        accent: '#9b59b6',
        tagline: 'Events & Venues',
        transition: { type: 'spring', stiffness: 200, damping: 25 },
        exitAnim: { scale: 0, rotate: -180, opacity: 0 },
    },
    {
        name: 'Administration',
        icon: '🏛️',
        colors: ['#20bf6b', '#26de81'],
        accent: '#2ed573',
        tagline: 'Office & Records',
        transition: { type: 'tween', duration: 0.5 },
        exitAnim: { y: 300, scale: 0.3, opacity: 0 },
    },
    {
        name: 'Sports',
        icon: '⚽',
        colors: ['#FA8231', '#FD9644'],
        accent: '#e17055',
        tagline: 'Games & Fitness',
        transition: { type: 'spring', stiffness: 400, damping: 10 },
        exitAnim: { x: -300, rotate: -90, opacity: 0 },
    },
    {
        name: 'Others',
        icon: '📋',
        colors: ['#3867d6', '#4b7bec'],
        accent: '#3742fa',
        tagline: 'Miscellaneous',
        transition: { type: 'tween', duration: 0.8, ease: 'circOut' },
        exitAnim: { scale: 2, opacity: 0, filter: 'blur(20px)' },
    },
];

const CategoryWheel = ({ onSelectCategory, onBack }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isSpinning, setIsSpinning] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [selectedCat, setSelectedCat] = useState(null);
    const [showRipple, setShowRipple] = useState(false);
    const animRef = useRef(null);
    const lastTimeRef = useRef(null);
    const rotationRef = useRef(0);

    useEffect(() => {
        const animate = (timestamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const delta = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;
            if (isSpinning) {
                rotationRef.current += delta * 0.03;
                setRotation(rotationRef.current);
            }
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [isSpinning]);

    const numSegments = CATEGORIES.length;
    const anglePerSegment = 360 / numSegments;
    const radius = 190;
    const innerRadius = 62;
    const centerX = 230;
    const centerY = 230;

    const getSegmentPath = (index) => {
        const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);
        const x1o = centerX + radius * Math.cos(startAngle);
        const y1o = centerY + radius * Math.sin(startAngle);
        const x2o = centerX + radius * Math.cos(endAngle);
        const y2o = centerY + radius * Math.sin(endAngle);
        const x1i = centerX + innerRadius * Math.cos(endAngle);
        const y1i = centerY + innerRadius * Math.sin(endAngle);
        const x2i = centerX + innerRadius * Math.cos(startAngle);
        const y2i = centerY + innerRadius * Math.sin(startAngle);
        return `M${x2i},${y2i} L${x1o},${y1o} A${radius},${radius} 0 0 1 ${x2o},${y2o} L${x1i},${y1i} A${innerRadius},${innerRadius} 0 0 0 ${x2i},${y2i} Z`;
    };

    const getMidPosition = (index, r) => {
        const midAngle = ((index + 0.5) * anglePerSegment - 90) * (Math.PI / 180);
        return { x: centerX + r * Math.cos(midAngle), y: centerY + r * Math.sin(midAngle) };
    };

    // Decorative tick marks around outer edge
    const tickMarks = useMemo(() => {
        const ticks = [];
        for (let i = 0; i < 42; i++) {
            const angle = (i * (360 / 42) - 90) * (Math.PI / 180);
            const isMajor = i % 6 === 0;
            const r1 = radius + 6;
            const r2 = radius + (isMajor ? 18 : 12);
            ticks.push({
                x1: centerX + r1 * Math.cos(angle),
                y1: centerY + r1 * Math.sin(angle),
                x2: centerX + r2 * Math.cos(angle),
                y2: centerY + r2 * Math.sin(angle),
                isMajor,
            });
        }
        return ticks;
    }, []);

    const handleSegmentClick = (cat, index) => {
        setIsSpinning(false);
        setSelectedCat({ ...cat, index });
        setShowRipple(true);
        setTimeout(() => onSelectCategory(cat.name), 700);
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center select-none"
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={selectedCat ? selectedCat.exitAnim : { opacity: 0, scale: 0.5 }}
            transition={selectedCat ? selectedCat.transition : { duration: 0.6, type: 'spring', bounce: 0.25 }}
        >
            {/* Title */}
            <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-1 tracking-tight">
                    What's the issue?
                </h2>
                <p className="text-gray-400 text-sm tracking-wide">
                    Spin • Hover • Click to choose
                </p>
            </motion.div>

            <div
                className="relative"
                onMouseEnter={() => setIsSpinning(false)}
                onMouseLeave={() => { setHoveredIndex(null); if (!selectedCat) setIsSpinning(true); }}
            >
                {/* Ambient glow rings */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: 440, height: 440, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: 480, height: 480, border: '1px solid rgba(99,102,241,0.08)' }}
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Ripple on click */}
                <AnimatePresence>
                    {showRipple && selectedCat && (
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-30"
                            style={{ width: 60, height: 60, background: selectedCat.accent }}
                            initial={{ scale: 0, opacity: 0.8 }}
                            animate={{ scale: 12, opacity: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                    )}
                </AnimatePresence>

                <svg
                    width="460"
                    height="460"
                    viewBox="0 0 460 460"
                    className="relative z-10 cursor-pointer"
                    style={{ transform: `rotate(${rotation}deg)`, filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.15))' }}
                >
                    <defs>
                        {CATEGORIES.map((cat, i) => (
                            <linearGradient key={cat.name} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={cat.colors[0]} />
                                <stop offset="100%" stopColor={cat.colors[1]} />
                            </linearGradient>
                        ))}
                        <filter id="segShadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                        </filter>
                        <radialGradient id="centerGrad" cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#f1f5f9" />
                        </radialGradient>
                    </defs>

                    {/* Outer decorative ring */}
                    <circle cx={centerX} cy={centerY} r={radius + 5} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <circle cx={centerX} cy={centerY} r={radius + 20} fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="1" />

                    {/* Tick marks */}
                    {tickMarks.map((t, i) => (
                        <line
                            key={i}
                            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                            stroke={t.isMajor ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)'}
                            strokeWidth={t.isMajor ? 2.5 : 1}
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Segments */}
                    {CATEGORIES.map((cat, i) => {
                        const iconPos = getMidPosition(i, radius * 0.56);
                        const labelPos = getMidPosition(i, radius * 0.78);
                        const isHovered = hoveredIndex === i;

                        return (
                            <g
                                key={cat.name}
                                onClick={() => handleSegmentClick(cat, i)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                                    transformOrigin: `${centerX}px ${centerY}px`,
                                    transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
                                }}
                            >
                                {/* Segment path */}
                                <path
                                    d={getSegmentPath(i)}
                                    fill={`url(#grad-${i})`}
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeWidth="1.5"
                                    filter={isHovered ? 'url(#segShadow)' : undefined}
                                    opacity={isHovered ? 1 : 0.88}
                                />

                                {/* Shimmer on hover */}
                                {isHovered && (
                                    <path
                                        d={getSegmentPath(i)}
                                        fill="rgba(255,255,255,0.18)"
                                    />
                                )}

                                {/* Icon (counter-rotated) */}
                                <text
                                    x={iconPos.x}
                                    y={iconPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize={isHovered ? '30' : '24'}
                                    style={{
                                        transform: `rotate(${-rotation}deg)`,
                                        transformOrigin: `${iconPos.x}px ${iconPos.y}px`,
                                        transition: 'font-size 0.2s ease',
                                        filter: isHovered ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' : 'none',
                                    }}
                                >
                                    {cat.icon}
                                </text>

                                {/* Label */}
                                <text
                                    x={labelPos.x}
                                    y={labelPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="white"
                                    fontWeight="700"
                                    fontSize={isHovered ? '12' : '10'}
                                    letterSpacing="0.5"
                                    style={{
                                        transform: `rotate(${-rotation}deg)`,
                                        transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                        transition: 'font-size 0.2s ease',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {cat.name}
                                </text>
                            </g>
                        );
                    })}

                    {/* Center hub - premium look */}
                    <circle cx={centerX} cy={centerY} r={innerRadius + 4} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <circle
                        cx={centerX} cy={centerY} r={innerRadius}
                        fill="url(#centerGrad)"
                        stroke="rgba(226,232,240,0.6)"
                        strokeWidth="2"
                    />
                    {/* Inner decorative ring */}
                    <circle cx={centerX} cy={centerY} r={innerRadius - 8} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1" strokeDasharray="4 3" />

                    <text
                        x={centerX} y={centerY - 10}
                        textAnchor="middle" fill="#1e3a8a" fontWeight="900" fontSize="15"
                        letterSpacing="2"
                        style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${centerX}px ${centerY}px` }}
                    >
                        NFSU
                    </text>
                    <text
                        x={centerX} y={centerY + 10}
                        textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600"
                        letterSpacing="1.5"
                        style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${centerX}px ${centerY}px`, textTransform: 'uppercase' }}
                    >
                        Complaints
                    </text>

                    {/* Pointer / needle at top */}
                    <g style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${centerX}px ${centerY}px` }}>
                        <polygon
                            points={`${centerX - 10},8 ${centerX + 10},8 ${centerX},32`}
                            fill="#1e293b"
                            stroke="white"
                            strokeWidth="1.5"
                            filter="url(#segShadow)"
                        />
                        <circle cx={centerX} cy="8" r="3" fill="#1e293b" stroke="white" strokeWidth="1" />
                    </g>
                </svg>
            </div>

            {/* Hovered category tooltip */}
            <AnimatePresence mode="wait">
                {hoveredIndex !== null && (
                    <motion.div
                        key={hoveredIndex}
                        className="mt-6 flex items-center space-x-3 px-6 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm"
                        style={{ background: `linear-gradient(135deg, ${CATEGORIES[hoveredIndex].colors[0]}, ${CATEGORIES[hoveredIndex].colors[1]})` }}
                        initial={{ opacity: 0, y: 15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-2xl">{CATEGORIES[hoveredIndex].icon}</span>
                        <div>
                            <p className="text-white font-bold text-lg leading-tight">{CATEGORIES[hoveredIndex].name}</p>
                            <p className="text-white/70 text-xs">{CATEGORIES[hoveredIndex].tagline}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back button */}
            <motion.button
                onClick={onBack}
                className="mt-8 group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="text-sm font-medium">Back to Dashboard</span>
            </motion.button>
        </motion.div>
    );
};

export default CategoryWheel;
