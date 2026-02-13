import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import memories
import memory1 from '../assets/memories/memory1.jpg';
import memory2 from '../assets/memories/memory2.jpg';
import memory3 from '../assets/memories/memory3.jpg';
import memory4 from '../assets/memories/memory4.jpg';
import memory5 from '../assets/memories/memory5.jpg';
import memory6 from '../assets/memories/memory6.jpg';
import memory7 from '../assets/memories/memory7.jpg';
import memory8 from '../assets/memories/memory8.jpg';
import memory9 from '../assets/memories/memory9.jpg';
import memory10 from '../assets/memories/memory10.jpg';
import memory11 from '../assets/memories/memory11.jpg';
import memory12 from '../assets/memories/memory12.jpg';

const MemoryCard = ({ title, message, index, isActive, img }) => {
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
                height: 'min(550px, 75vh)', // Slightly taller for images
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
            {/* Real Photo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: '280px',
                    aspectRatio: '1/1',
                    marginBottom: '30px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '4px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                }}
            >
                <img
                    src={img}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
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
                    fontSize: '1.8rem',
                    marginBottom: '15px',
                    fontFamily: 'Playfair Display, serif',
                }}
            >
                {title}
            </motion.h3>

            <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-soft)',
                lineHeight: '1.6',
            }}>
                {message}
            </p>
        </motion.div>
    );
};

const Scene3_Memories = ({ onNext }) => {
    const memories = [
        {
            title: "Us ❤️",
            message: "Every picture tells a story of love.",
            img: memory1
        },
        {
            title: "Beautiful Moments ✨",
            message: "Cherishing every second with you.",
            img: memory2
        },
        {
            title: "Just You & Me 🌹",
            message: "The world fades away when I'm with you.",
            img: memory3
        },
        {
            title: "Smiles 😊",
            message: "Your happiness is my favorite sight.",
            img: memory4
        },
        {
            title: "Adventures 🌍",
            message: "Exploring life hand in hand.",
            img: memory5
        },
        {
            title: "Sweet Memories 🍬",
            message: "Moments I'll keep in my heart forever.",
            img: memory6
        },
        {
            title: "Together Forever ♾️",
            message: "Building a lifetime of memories.",
            img: memory7
        },
        {
            title: "My Love �",
            message: "You are the best thing that ever happened to me.",
            img: memory8
        },
        {
            title: "Happiness 😄",
            message: "You are the reason for my smile.",
            img: memory9
        },
        {
            title: "Dino Hands 🦕",
            message: "My favorite person in the whole universe.",
            img: memory10
        },
        {
            title: "Magic ✨",
            message: "Every day with you is magical.",
            img: memory11
        },
        {
            title: "I Love You 💝",
            message: "More than words can ever say.",
            img: memory12
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
