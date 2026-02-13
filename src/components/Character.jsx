import React from 'react';
import { motion } from 'framer-motion';

const Character = ({ color, isPartner, scaleY = 1, facing = 'right' }) => (
    <div style={{
        position: 'relative',
        width: '60px',
        height: '60px',
        transform: `scaleX(${facing === 'left' ? -1 : 1}) scaleY(${scaleY})`,
        transformOrigin: 'bottom center',
        transition: 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
    }}>
        <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Main body with gradient */}
            <defs>
                <radialGradient id={`grad-${color}`}>
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Body */}
            <motion.ellipse
                cx="50" cy="55" rx="35" ry="38"
                fill={`url(#grad-${color})`}
                animate={{
                    ry: [38, 40, 38]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Eyes with sparkle */}
            <g>
                <motion.circle
                    cx="38" cy="45" r="4"
                    fill="#2c3e50"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 3 + Math.random() * 2
                    }}
                />
                <circle cx="40" cy="43" r="1.5" fill="white" opacity="0.8" />

                <motion.circle
                    cx="62" cy="45" r="4"
                    fill="#2c3e50"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 3 + Math.random() * 2
                    }}
                />
                <circle cx="64" cy="43" r="1.5" fill="white" opacity="0.8" />
            </g>

            {/* Blush */}
            <circle cx="30" cy="58" r="5" fill="#ff6b9d" opacity="0.3" />
            <circle cx="70" cy="58" r="5" fill="#ff6b9d" opacity="0.3" />

            {/* Smile */}
            <path
                d="M 40 62 Q 50 68 60 62"
                stroke="#2c3e50"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
        </svg>

        {/* Partner glow effect */}
        {isPartner && (
            <>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '70px',
                        height: '70px',
                        background: 'radial-gradient(circle, rgba(255,105,180,0.6) 0%, transparent 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '20px'
                }}>
                    ✨
                </div>
            </>
        )}
    </div>
);

export default Character;
