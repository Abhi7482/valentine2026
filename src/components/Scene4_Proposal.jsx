import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';
import Character from './Character';
import { FloatingHearts, Sparkles } from './ParticleEffects';

const Scene4_Proposal = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [celebrate, setCelebrate] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowButtons(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleYes = () => {
        setCelebrate(true);
        setTimeout(() => setShowSuccess(true), 1000);
    };

    return (
        <div className="scene gradient-bg-4" style={{ overflow: 'hidden' }}>
            {/* Background Particles */}
            <FloatingHearts count={15} />
            <Sparkles count={30} />

            {/* Confetti */}
            {celebrate && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                }}>
                    <ConfettiExplosion
                        force={0.8}
                        duration={3000}
                        particleCount={400}
                        width={2000}
                        colors={['#ff6b9d', '#ff8fab', '#a18cd1', '#ffffff']}
                    />
                </div>
            )}

            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
            }}>
                <AnimatePresence mode="wait">
                    {!showSuccess ? (
                        <motion.div
                            key="proposal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            transition={{ duration: 1 }}
                            style={{ textAlign: 'center', width: '100%', maxWidth: '800px', padding: '20px' }}
                        >
                            {/* Intro Text */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="glow-text"
                                style={{
                                    fontSize: 'clamp(3rem, 6vw, 5rem)',
                                    marginBottom: '40px',
                                }}
                            >
                                Dino...
                            </motion.h1>

                            {/* Center Visuals - Characters waiting */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5, duration: 1, type: "spring" }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    gap: '20px',
                                    marginBottom: '50px',
                                    height: '100px'
                                }}
                            >
                                <Character color="#00ffff" facing="right" scaleY={1} />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ fontSize: '3rem' }}
                                >
                                    ❓
                                </motion.div>
                                <Character color="#ff69b4" facing="left" scaleY={1} />
                            </motion.div>

                            {/* The Question */}
                            <motion.h2
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 2.5, delay: 2.5 }}
                                style={{
                                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                    marginBottom: '50px',
                                    lineHeight: '1.4',
                                }}
                            >
                                Will you be my Valentine? ❤️
                            </motion.h2>

                            {/* Buttons */}
                            <AnimatePresence>
                                {showButtons && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(255, 107, 157, 0.6)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleYes}
                                            className="btn btn-primary"
                                        >
                                            YES 💖
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(255, 107, 157, 0.6)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleYes}
                                            className="btn btn-primary"
                                        >
                                            YES OF COURSE 💖
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="glass"
                            style={{
                                padding: '50px',
                                maxWidth: '90%',
                                width: '700px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background: 'rgba(255, 255, 255, 0.3)', // Explicitly visible
                                border: '2px solid rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            {/* Characters Together - Scaled Up */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                gap: '20px',
                                marginBottom: '40px',
                                position: 'relative',
                                transform: 'scale(1.4)'
                            }}>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Character color="#00ffff" facing="right" scaleY={1} />
                                </motion.div>

                                {/* Pulsing Heart Between Them */}
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    style={{ fontSize: '3.5rem', margin: '0 15px', paddingBottom: '20px' }}
                                >
                                    💖
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                                >
                                    <Character color="#ff69b4" facing="left" scaleY={1} isPartner />
                                </motion.div>
                            </div>

                            {/* Success Message */}
                            <motion.div
                                className="glow-text"
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                    marginBottom: '30px',
                                    lineHeight: '1.3',
                                    fontWeight: '700',
                                    color: '#2c3e50',
                                    textAlign: 'center'
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                >
                                    You just made me the
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 1 }}
                                    style={{ color: '#ff1493', marginTop: '10px' }}
                                >
                                    happiest person alive! 💖
                                </motion.div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.0 }}
                                style={{
                                    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                                    color: '#2c3e50',
                                    marginTop: '20px',
                                    fontWeight: '600',
                                    fontFamily: 'Quicksand, sans-serif'
                                }}
                            >
                                I can't wait to make more beautiful memories with you.
                            </motion.p>

                            <div style={{ marginTop: '40px', fontSize: '1.1rem', opacity: 0.8, color: '#5a5a5a', fontStyle: 'italic' }}>
                                Made with all my love, for you. 🌹
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Scene4_Proposal;
