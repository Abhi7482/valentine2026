import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const Scene1_Entry = ({ onNext }) => {
    return (
        <div className="scene gradient-bg-1">
            <ParticleBackground />

            {/* Decorative corner elements */}
            <div className="corner-decoration corner-top-left">
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <circle cx="0" cy="0" r="50" fill="#d4576d" />
                </svg>
            </div>

            <div className="corner-decoration corner-bottom-right">
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <circle cx="100" cy="100" r="70" fill="#d4576d" />
                </svg>
            </div>

            <div className="scene-content">
                {/* Date header - magazine style */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-date"
                >
                    Valentine's Day 2026
                </motion.div>

                {/* Main headline - serif, editorial style */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-headline"
                >
                    Hi Dino Hands
                </motion.h1>

                {/* Decorative divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="divider-gradient"
                    style={{ marginBottom: '30px' }}
                />

                {/* Subtitle - lighter serif */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="text-subheadline"
                >
                    I made something special for you
                </motion.p>

                {/* Floating hearts - subtle, refined */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.3, 0.3, 0],
                            scale: [0, 1, 1, 0],
                            y: [0, -120],
                            x: [0, (Math.random() - 0.5) * 80],
                        }}
                        transition={{
                            duration: 6,
                            delay: 2 + i * 0.4,
                            repeat: Infinity,
                            repeatDelay: 2,
                        }}
                        className="floating-element"
                        style={{
                            left: `${20 + i * 12}%`,
                            top: '60%',
                            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                            color: 'var(--primary)',
                            opacity: 0.3
                        }}
                    >
                        ♥
                    </motion.div>
                ))}

                {/* Minimalist sparkles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            delay: 2 + i * 0.3,
                            repeat: Infinity,
                            repeatDelay: 4,
                        }}
                        className="floating-element"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: '0.8rem',
                            color: 'var(--primary)'
                        }}
                    >
                        ✦
                    </motion.div>
                ))}

                {/* CTA Button - refined, editorial */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 2,
                    }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: '0 10px 40px rgba(212, 87, 109, 0.15)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNext}
                    className="btn btn-primary"
                >
                    Enter
                </motion.button>

                {/* Byline at bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="text-byline"
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    A love story in moments
                </motion.div>
            </div>
        </div>
    );
};

export default Scene1_Entry;
