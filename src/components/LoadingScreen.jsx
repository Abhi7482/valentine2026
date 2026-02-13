import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsComplete(true);
                        setTimeout(() => onLoadComplete(), 500);
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onLoadComplete]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                    }}
                >
                    {/* Animated Heart */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            fontSize: '80px',
                            marginBottom: '40px',
                        }}
                    >
                        💖
                    </motion.div>

                    {/* Loading Text */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '2rem',
                            marginBottom: '30px',
                            color: 'var(--text-light)',
                        }}
                    >
                        Preparing something special...
                    </motion.h2>

                    {/* Progress Bar */}
                    <div
                        style={{
                            width: '300px',
                            height: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                borderRadius: '10px',
                                boxShadow: '0 0 10px var(--primary)',
                            }}
                        />
                    </div>

                    {/* Progress Percentage */}
                    <motion.p
                        style={{
                            marginTop: '15px',
                            color: 'var(--text-soft)',
                            fontSize: '0.9rem',
                        }}
                    >
                        {progress}%
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
