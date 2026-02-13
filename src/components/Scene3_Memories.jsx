import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MemoryCard = ({ title, message, index, isActive }) => {
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            animate={{
                opacity: isActive ? 1 : 0.3,
                rotateY: 0,
                scale: isActive ? 1 : 0.85,
                x: isActive ? 0 : index < 2 ? -100 : 100,
            }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={isActive ? { scale: 1.05, rotateY: 5 } : {}}
            className="glass"
            style={{
                width: 'min(400px, 90vw)',
                height: 'min(500px, 70vh)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: isActive ? 'auto' : 'none',
                boxShadow: isActive ? '0 20px 60px rgba(255, 20, 147, 0.4)' : 'none',
            }}
        >
            {/* Photo Placeholder with Animation */}
            <motion.div
                animate={isActive ? {
                    scale: [1, 1.05, 1],
                } : {}}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    width: '220px',
                    height: '220px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.3), rgba(139, 0, 139, 0.3))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '30px',
                    fontSize: '5rem',
                    border: '3px solid rgba(255, 20, 147, 0.4)',
                    boxShadow: isActive ? '0 10px 30px rgba(255, 20, 147, 0.3)' : 'none',
                }}
            >
                📸
            </motion.div>

            <motion.h3
                animate={isActive ? {
                    color: ['#ff1493', '#ff69b4', '#ff1493'],
                } : {}}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                }}
                style={{
                    fontSize: '2rem',
                    marginBottom: '15px',
                    fontFamily: 'Playfair Display, serif',
                }}
            >
                {title}
            </motion.h3>

            <p style={{
                fontSize: '1.2rem',
                color: 'var(--text-soft)',
                lineHeight: '1.8',
            }}>
                {message}
            </p>
        </motion.div>
    );
};

const Scene3_Memories = ({ onNext }) => {
    const memories = [
        {
            title: "Our First Date 🌹",
            message: "The moment I knew this was something special"
        },
        {
            title: "When I Knew 💭",
            message: "You were different from everyone else"
        },
        {
            title: "My Favorite Memory 📸",
            message: "Every moment with you becomes my new favorite"
        },
        {
            title: "Falling For You 💘",
            message: "It happened before I even realized it"
        },
        {
            title: "Every Day 🎈",
            message: "With you is an adventure I never want to end"
        }
    ];

    const [currentCard, setCurrentCard] = useState(0);

    const handleNext = () => {
        if (currentCard < memories.length - 1) {
            setCurrentCard(currentCard + 1);
        } else {
            onNext();
        }
    };

    const handlePrev = () => {
        if (currentCard > 0) {
            setCurrentCard(currentCard - 1);
        }
    };

    return (
        <div className="scene gradient-bg-3">
            {/* Floating particles in background */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, (Math.random() - 0.5) * 50, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: '1.5rem',
                        pointerEvents: 'none',
                    }}
                >
                    💖
                </motion.div>
            ))}

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    position: 'absolute',
                    top: '50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                    fontFamily: 'Playfair Display, serif',
                    zIndex: 20,
                    textAlign: 'center',
                }}
            >
                Our Memories Together
            </motion.h2>

            {/* Cards Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {memories.map((memory, index) => (
                    <MemoryCard
                        key={index}
                        title={memory.title}
                        message={memory.message}
                        index={index}
                        isActive={index === currentCard}
                    />
                ))}
            </div>

            {/* Navigation */}
            <div style={{
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                zIndex: 20,
            }}
            >
                <motion.button
                    whileHover={{ scale: currentCard === 0 ? 1 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    disabled={currentCard === 0}
                    className="btn interactive"
                    style={{
                        padding: '15px 30px',
                        background: currentCard === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 20, 147, 0.4)',
                        border: '2px solid var(--primary)',
                        borderRadius: '50px',
                        color: 'white',
                        fontSize: '1.2rem',
                        opacity: currentCard === 0 ? 0.3 : 1,
                        cursor: currentCard === 0 ? 'not-allowed' : 'pointer',
                    }}
                >
                    ← Previous
                </motion.button>

                {/* Progress Dots */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {memories.map((_, index) => (
                        <motion.div
                            key={index}
                            animate={{
                                scale: index === currentCard ? 1.3 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                background: index === currentCard ? 'var(--primary)' : 'rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s ease',
                                boxShadow: index === currentCard ? '0 0 15px var(--primary)' : 'none',
                            }}
                        />
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    className="btn btn-primary interactive"
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                    }}
                >
                    {currentCard === memories.length - 1 ? 'Continue ✨' : 'Next →'}
                </motion.button>
            </div>
        </div>
    );
};

export default Scene3_Memories;
