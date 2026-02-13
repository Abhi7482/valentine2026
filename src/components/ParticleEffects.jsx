import React from 'react';
import { motion } from 'framer-motion';

export const FloatingHearts = ({ count = 8 }) => (
    <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: count }).map((_, i) => (
            <motion.div
                key={i}
                initial={{
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 50,
                    rotate: Math.random() * 360
                }}
                animate={{
                    y: -100,
                    x: [null, Math.random() * window.innerWidth],
                    rotate: [null, Math.random() * 360 + 360]
                }}
                transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    fontSize: '24px',
                    opacity: 0.15
                }}
            >
                💕
            </motion.div>
        ))}
    </div>
);

export const Sparkles = ({ count = 25 }) => (
    <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {Array.from({ length: count }).map((_, i) => (
            <motion.div
                key={i}
                initial={{
                    opacity: 0,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0
                }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180]
                }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    fontSize: '16px'
                }}
            >
                ✨
            </motion.div>
        ))}
    </div>
);
