import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';
import Character from './Character';

const Scene4_Proposal = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [celebrate, setCelebrate] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowButtons(true), 3500);
        return () => clearTimeout(timer);
    }, []);

    const handleYes = () => {
        setCelebrate(true);
        setTimeout(() => setShowSuccess(true), 1000);
    };

    return (
        <div className="scene gradient-bg-1">
            {/* Subtle background decoration */}
            <div className="floating-element" style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 87, 109, 0.03), transparent)',
            }} />

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
                        force={0.6}
                        duration={3500}
                        particleCount={200}
                        width={1600}
                        colors={['#d4576d', '#f5a3a3', '#fff', '#ffe8e8']}
                    />
                </div>
            )}

            <div className="scene-content">
                <AnimatePresence mode="wait">
                    {!showSuccess ? (
                        <motion.div
                            key="proposal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 1 }}
                            className="modal-card"
                            style={{ padding: '40px' }}
                        >
                            {/* Date header */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-date"
                            >
                                A Special Question
                            </motion.div>

                            {/* Greeting */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="text-headline"
                                style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '50px' }}
                            >
                                Dino...
                            </motion.h1>

                            {/* Characters */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    gap: '30px',
                                    marginBottom: '60px',
                                    height: '100px'
                                }}
                            >
                                <Character color="#5a9aa0" facing="right" scaleY={1} />
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        fontSize: '2.5rem',
                                        color: 'var(--primary)',
                                        alignSelf: 'center'
                                    }}
                                >
                                    ♥
                                </motion.div>
                                <Character color="#d4576d" facing="left" scaleY={1} isPartner />
                            </motion.div>

                            {/* Decorative line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 1.8 }}
                                className="divider-gradient"
                                style={{ margin: '0 auto 50px' }}
                            />

                            {/* The Question */}
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.5, delay: 2.2 }}
                                className="text-headline"
                                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: '1.3' }}
                            >
                                Will you be my Valentine?
                            </motion.h2>

                            {/* Buttons */}
                            <AnimatePresence>
                                {showButtons && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                        style={{
                                            position: 'relative',
                                            height: '60px',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '40px'
                                        }}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.1, boxShadow: "0 10px 35px rgba(212, 87, 109, 0.4)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleYes}
                                            className="btn btn-primary"
                                            style={{
                                                fontSize: '1.2rem',
                                                padding: '12px 40px',
                                                zIndex: 10
                                            }}
                                        >
                                            Yes, I Will! 💖
                                        </motion.button>

                                        <motion.button
                                            onHoverStart={() => {
                                                // Run away logic
                                                const x = Math.random() * 200 - 100; // -100 to 100
                                                const y = Math.random() * 200 - 100;
                                                const btn = document.getElementById('no-btn');
                                                if (btn) {
                                                    btn.style.transform = `translate(${x}px, ${y}px)`;
                                                }
                                            }}
                                            id="no-btn"
                                            className="btn"
                                            style={{
                                                background: '#f1f5f9',
                                                color: '#64748b',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '1rem',
                                                padding: '12px 30px',
                                                transition: 'all 0.2s ease',
                                                position: 'absolute',
                                                left: 'calc(50% + 100px)' // Start position to the right
                                            }}
                                        >
                                            No
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                            className="modal-card-success"
                        >
                            {/* Success header */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-date"
                            >
                                She Said Yes
                            </motion.div>

                            {/* Characters Together */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                gap: '25px',
                                marginBottom: '50px',
                                position: 'relative'
                            }}>
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Character color="#5a9aa0" facing="right" scaleY={1} />
                                </motion.div>

                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ fontSize: '3rem', color: 'var(--primary)', paddingBottom: '15px' }}
                                >
                                    ♥
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                >
                                    <Character color="#d4576d" facing="left" scaleY={1} isPartner />
                                </motion.div>
                            </div>

                            {/* Decorative line */}
                            <div className="divider-gradient" style={{ width: '80px', margin: '0 auto 40px' }} />

                            {/* Success message */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h1 className="text-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2' }}>
                                    You just made me the<br />
                                    happiest person alive
                                </h1>

                                <p className="text-subheadline" style={{ marginBottom: '50px' }}>
                                    I can't wait to make more beautiful memories with you.
                                </p>
                            </motion.div>

                            {/* Byline */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="text-byline"
                                style={{
                                    paddingTop: '30px',
                                    borderTop: '1px solid var(--accent-border)'
                                }}
                            >
                                Made with all my love, for you
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Scene4_Proposal;
