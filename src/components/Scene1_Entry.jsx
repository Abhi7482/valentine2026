import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const Scene1_Entry = ({ onNext }) => {
    return (
        <div className="scene gradient-bg-1">
            <ParticleBackground />

            <div style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                padding: '20px',
            }}>
                {/* Main Message */}
                <motion.h1
                    className="glow-text"
                    style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '5px' // Space between letters
                    }}
                >
                    {Array.from("Hi Dino Hands...").map((letter, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.5 + index * 0.1, // Typewriter delay
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    style={{
                        fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
                        color: 'var(--text-soft)',
                        marginBottom: '60px',
                    }}
                >
                    I made something for you ❤️
                </motion.p>

                {/* Floating Hearts - More Dynamic */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1.5, 1.5, 0],
                            y: [0, -150],
                            x: [0, (Math.random() - 0.5) * 100],
                            rotate: [0, (Math.random() - 0.5) * 360],
                        }}
                        transition={{
                            duration: 5,
                            delay: 2 + i * 0.25,
                            repeat: Infinity,
                            repeatDelay: 1,
                        }}
                        style={{
                            position: 'absolute',
                            left: `${15 + i * 10}%`,
                            top: '65%',
                            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            pointerEvents: 'none',
                        }}
                    >
                        💖
                    </motion.div>
                ))}

                {/* Sparkles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            delay: 1.5 + i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 3,
                        }}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: '1.5rem',
                            pointerEvents: 'none',
                        }}
                    >
                        ✨
                    </motion.div>
                ))}

                {/* Enter Button - Enhanced */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 2,
                        type: 'spring',
                        bounce: 0.5,
                    }}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: '0 20px 50px rgba(255, 20, 147, 0.6)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary interactive"
                    onClick={onNext}
                    style={{
                        marginTop: '40px',
                        fontSize: '1.4rem',
                        padding: '20px 60px',
                    }}
                >
                    <motion.span
                        animate={{
                            opacity: [1, 0.7, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    >
                        Enter ✨
                    </motion.span>
                </motion.button>

                {/* Pulsing glow behind button */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '18%',
                        left: '50%',
                        transform: 'translate(-50%, 50%)',
                        width: '300px',
                        height: '100px',
                        background: 'radial-gradient(circle, rgba(255, 20, 147, 0.4), transparent)',
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        pointerEvents: 'none',
                        zIndex: -1,
                    }}
                />
            </div>
        </div>
    );
};

export default Scene1_Entry;
