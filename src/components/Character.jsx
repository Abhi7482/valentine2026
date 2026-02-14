import React from 'react';
import { motion } from 'framer-motion';
// Import the image directly
import cuteDino from '../Cute-Dinosaur-PNG-File.png';

const Character = ({ color, isPartner, scaleY = 1, facing = 'right' }) => (
    <div style={{
        position: 'relative',
        width: '70px',
        height: '70px',
        transform: `scaleX(${facing === 'left' ? -1 : 1}) scaleY(${scaleY})`,
        transformOrigin: 'bottom center',
        transition: 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
        zIndex: 10
    }}>
        {isPartner ? (
            // CUTE DINOSAUR - FROM PNG
            <motion.img
                src={cuteDino}
                alt="Cute Dinosaur"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transformOrigin: 'bottom center'
                }}
                animate={{
                    scaleY: [1, 0.95, 1],
                    y: [0, 2, 0]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        ) : (
            // JAMES BOND - SVG (UNCHANGED)
            <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <g>
                    {/* Suit Jacket (Black Tuxedo) - Slimmer */}
                    <path d="M 35 50 L 35 85 Q 35 90 40 90 L 60 90 Q 65 90 65 85 L 65 50 L 50 82 Z" fill="#0f172a" />

                    {/* White Shirt Triangle - Narrower */}
                    <path d="M 50 50 L 42 50 L 50 78 L 58 50 Z" fill="white" />

                    {/* Sleeves/Arms - Adjusted for slimmer body */}
                    <path d="M 35 52 L 28 78" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 65 52 L 72 78" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="28" cy="78" r="4" fill="#ffedd5" /> {/* Hand */}
                    <circle cx="72" cy="78" r="4" fill="#ffedd5" /> {/* Hand */}

                    {/* Pants - Slimmer */}
                    <path d="M 38 90 L 38 100 L 46 100 L 46 90 Z" fill="#0f172a" />
                    <path d="M 54 90 L 54 100 L 62 100 L 62 90 Z" fill="#0f172a" />

                    {/* Shoes - Slimmer */}
                    <ellipse cx="42" cy="102" rx="5" ry="3" fill="black" />
                    <ellipse cx="58" cy="102" rx="5" ry="3" fill="black" />

                    {/* Head - Proportional */}
                    <circle cx="50" cy="36" r="14" fill="#ffedd5" />

                    {/* Hair - Stylish Side Part (Adjusted for head size) */}
                    <path d="M 32 32 Q 34 18 50 18 Q 66 18 68 32 Q 70 38 66 36 Q 63 28 50 28 Q 37 28 34 36 Z" fill="#1e293b" />

                    {/* Face Details */}
                    <circle cx="45" cy="36" r="1.5" fill="#1e293b" />
                    <circle cx="55" cy="36" r="1.5" fill="#1e293b" />

                    {/* Eyebrows (Confident) */}
                    <path d="M 43 32 L 47 31" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
                    <path d="M 53 31 L 57 32" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />

                    {/* Smile */}
                    <path d="M 45 42 Q 50 45 55 42" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                    {/* Bow Tie - Crisp */}
                    <path d="M 46 52 L 54 52 L 50 56 Z" fill="#0f172a" />
                    <circle cx="50" cy="52" r="2" fill="#ef4444" /> {/* Red center knot accent */}
                </g>
            </svg>
        )}

        {isPartner && (
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '110%',
                    height: '110%',
                    background: 'radial-gradient(circle, rgba(134, 194, 50, 0.25) 0%, transparent 60%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: -1
                }}
            />
        )}
    </div>
);

export default Character;
