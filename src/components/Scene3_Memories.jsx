import React, { useState, useEffect } from 'react';
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

const PolaroidCard = ({ title, message, img, index, onClick, isMobile }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Adjusted rotations for better mobile display
    const rotations = isMobile
        ? [-3, 2, -2, 3, -2, 2, -3, 2, -1, 3, -2, 2]
        : [-6, 4, -3, 5, -4, 3, -5, 4, -2, 6, -3, 3];
    const rotation = rotations[index % rotations.length];

    // Smaller offsets on mobile
    const offsets = isMobile
        ? [0, -8, 5, -10, 3, -5, 8, -12, 4, -6, 10, -9]
        : [0, -15, 10, -20, 5, -10, 15, -25, 8, -12, 20, -18];
    const yOffset = offsets[index % offsets.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 60, rotate: rotation + 8 }}
            animate={{
                opacity: 1,
                y: yOffset,
                rotate: isHovered ? 0 : rotation,
                scale: isHovered ? (isMobile ? 1.05 : 1.1) : 1,
            }}
            whileHover={{
                zIndex: 50,
                transition: { duration: 0.2 }
            }}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 12
            }}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
                maxWidth: isMobile ? '100%' : '300px',
                touchAction: 'manipulation'
            }}
        >
            {/* Polaroid Frame */}
            <div style={{
                background: '#ffffff',
                padding: isMobile ? '12px 12px 45px 12px' : '16px 16px 55px 16px',
                boxShadow: isHovered
                    ? '0 30px 80px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0,0,0,0.1)'
                    : '0 15px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.08)',
                borderRadius: '3px',
                transition: 'box-shadow 0.3s ease',
                position: 'relative',
            }}>
                {/* Photo Container */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '100%',
                    overflow: 'hidden',
                    background: '#f0f0f0',
                    borderRadius: '1px'
                }}>
                    {/* Placeholder */}
                    {!img || imageError ? (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: isMobile ? '2.5rem' : '3rem',
                            color: '#d4576d'
                        }}>
                            ♥
                        </div>
                    ) : (
                        <img
                            src={img}
                            alt={title}
                            loading="lazy"
                            onError={() => setImageError(true)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: isHovered
                                    ? 'blur(0px) grayscale(0%) brightness(1.1)'
                                    : 'blur(8px) grayscale(80%) brightness(0.9)',
                                transition: 'filter 0.5s ease',
                            }}
                        />
                    )}

                    {/* Hover Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to top, rgba(212, 87, 109, 0.85), rgba(212, 87, 109, 0.3) 40%, transparent 70%)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: isMobile ? '15px' : '20px',
                            pointerEvents: 'none'
                        }}
                    >
                        <div style={{
                            color: '#ffffff',
                            fontFamily: 'var(--font-body)',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            fontStyle: 'italic',
                            fontWeight: '600',
                            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                            letterSpacing: '0.3px'
                        }}>
                            {isMobile ? 'Tap to view ✦' : 'Click to view ✦'}
                        </div>
                    </motion.div>
                </div>

                {/* Handwritten Caption */}
                <div style={{
                    position: 'absolute',
                    bottom: isMobile ? '12px' : '16px',
                    left: isMobile ? '12px' : '16px',
                    right: isMobile ? '12px' : '16px',
                    height: isMobile ? '33px' : '39px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        fontFamily: "'Caveat', cursive",
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        color: '#4a3a3a',
                        textAlign: 'center',
                        lineHeight: '1.3',
                        fontWeight: '600'
                    }}>
                        {title}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MemoryModal = ({ memory, onClose, isMobile }) => {
    if (!memory) return null;

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.93)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '15px' : '20px',
                cursor: 'pointer',
                backdropFilter: 'blur(15px)',
                overflowY: 'auto'
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: isMobile ? '12px' : '8px',
                    maxWidth: isMobile ? '100%' : '1000px',
                    width: '100%',
                    maxHeight: isMobile ? '95vh' : '90vh',
                    overflow: 'auto',
                    cursor: 'default',
                    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.7)',
                    margin: 'auto'
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                    gap: isMobile ? '30px' : '60px',
                    padding: isMobile ? '30px 20px' : 'clamp(40px, 8vw, 70px)'
                }}>
                    {/* Photo */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '100%',
                        borderRadius: isMobile ? '8px' : '6px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
                    }}>
                        <img
                            src={memory.img}
                            alt={memory.title}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: isMobile ? '20px' : '28px',
                        padding: isMobile ? '0' : '20px 0'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: isMobile ? '0.8rem' : '0.85rem',
                            letterSpacing: isMobile ? '2px' : '3px',
                            textTransform: 'uppercase',
                            color: 'var(--text-soft)',
                            fontWeight: '500'
                        }}>
                            Memory {memory.index + 1} of 12
                        </div>

                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: isMobile ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: '700',
                            color: 'var(--text-dark)',
                            margin: 0,
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em'
                        }}>
                            {memory.title}
                        </h2>

                        <div style={{
                            width: isMobile ? '60px' : '80px',
                            height: isMobile ? '2px' : '3px',
                            background: 'var(--primary)',
                        }} />

                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: isMobile ? 'clamp(1rem, 4vw, 1.2rem)' : 'clamp(1.15rem, 2.5vw, 1.4rem)',
                            color: 'var(--text-medium)',
                            margin: 0,
                            lineHeight: '1.8',
                            fontStyle: 'italic'
                        }}>
                            {memory.message}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: '0 10px 35px rgba(212, 87, 109, 0.35)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onClose}
                            className="btn btn-primary"
                            style={{
                                marginTop: isMobile ? '10px' : '15px',
                                alignSelf: 'flex-start',
                                fontSize: isMobile ? '0.95rem' : '1.05rem',
                                padding: isMobile ? '14px 35px' : '16px 45px'
                            }}
                        >
                            Close ✕
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Scene3_Memories = ({ onNext }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    const memories = [
        { title: "Us ♥", message: "Every picture tells a story of love, written in glances and gentle touches.", img: memory1 },
        { title: "Beautiful Moments", message: "Cherishing every second with you, like precious pearls on a string.", img: memory2 },
        { title: "You & Me", message: "The world fades away when I'm with you, leaving only us.", img: memory3 },
        { title: "Smiles", message: "Your happiness is my favorite sight, brighter than any sunrise.", img: memory4 },
        { title: "Adventures", message: "Exploring life hand in hand, discovering new chapters together.", img: memory5 },
        { title: "Sweet Memories", message: "Moments I'll keep in my heart forever, like treasured photographs.", img: memory6 },
        { title: "Together Forever", message: "Building a lifetime of memories, one beautiful day at a time.", img: memory7 },
        { title: "My Love", message: "You are the best thing that ever happened to me, my greatest gift.", img: memory8 },
        { title: "Happiness", message: "You are the reason for my smile, my light in every season.", img: memory9 },
        { title: "Dino Hands ♥", message: "My favorite person in the whole universe, perfectly imperfect.", img: memory10 },
        { title: "Magic", message: "Every day with you is magical, filled with wonder and warmth.", img: memory11 },
        { title: "I Love You", message: "More than words can ever say, deeper than oceans, higher than stars.", img: memory12 }
    ];

    const [selectedMemory, setSelectedMemory] = useState(null);

    const handleCardClick = (memory, index) => {
        setSelectedMemory({ ...memory, index });
    };

    // Grid columns based on screen size
    const getGridColumns = () => {
        if (isMobile) return 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))';
        if (isTablet) return 'repeat(auto-fill, minmax(240px, 1fr))';
        return 'repeat(auto-fill, minmax(280px, 1fr))';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #fdfbfb 0%, #fff5f5 50%, #ffe8e8 100%)',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch'
        }}>
            {/* Decorative circles - hidden on mobile */}
            {!isMobile && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '100px',
                        right: '-120px',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(212, 87, 109, 0.06), transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: '150px',
                        left: '-80px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(212, 87, 109, 0.05), transparent 70%)',
                        pointerEvents: 'none'
                    }} />
                </>
            )}

            {/* Content Container */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                minHeight: '100%',
                paddingBottom: isMobile ? '60px' : '100px'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    padding: isMobile
                        ? '40px 20px 30px'
                        : 'clamp(50px, 8vh, 100px) 30px clamp(40px, 6vh, 70px)',
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: isMobile ? '0.75rem' : '0.95rem',
                            letterSpacing: isMobile ? '3px' : '4px',
                            textTransform: 'uppercase',
                            color: 'var(--text-soft)',
                            marginBottom: isMobile ? '12px' : '20px',
                            fontWeight: '500'
                        }}>
                            Our Story
                        </div>

                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: isMobile
                                ? 'clamp(2.2rem, 10vw, 3.5rem)'
                                : 'clamp(3rem, 8vw, 5.5rem)',
                            fontWeight: '700',
                            color: 'var(--text-dark)',
                            marginBottom: isMobile ? '15px' : '25px',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                            padding: isMobile ? '0 10px' : '0'
                        }}>
                            Our Memories Together
                        </h1>

                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: isMobile
                                ? 'clamp(0.95rem, 4vw, 1.15rem)'
                                : 'clamp(1.1rem, 2.5vw, 1.4rem)',
                            color: 'var(--text-medium)',
                            maxWidth: isMobile ? '100%' : '650px',
                            margin: '0 auto',
                            lineHeight: '1.7',
                            fontStyle: 'italic',
                            padding: isMobile ? '0 15px' : '0'
                        }}>
                            {isMobile ? 'Tap each photo to explore our moments' : 'Hover over each photo to explore our beautiful moments'}
                        </p>
                    </motion.div>
                </div>

                {/* Polaroid Gallery Grid */}
                <div style={{
                    maxWidth: isMobile ? '100%' : '1500px',
                    margin: '0 auto',
                    padding: isMobile ? '0 20px' : '0 clamp(25px, 6vw, 100px)',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: getGridColumns(),
                        gap: isMobile ? '35px 25px' : isTablet ? '35px 30px' : '40px 35px',
                        justifyItems: 'center',
                        alignItems: 'start'
                    }}>
                        {memories.map((memory, index) => (
                            <PolaroidCard
                                key={index}
                                {...memory}
                                index={index}
                                onClick={() => handleCardClick(memory, index)}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>

                    {/* Continue Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.8 }}
                        style={{
                            marginTop: isMobile ? '50px' : '80px',
                            textAlign: 'center'
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: isMobile ? 1 : 1.05, boxShadow: '0 12px 40px rgba(212, 87, 109, 0.35)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onNext}
                            className="btn btn-primary"
                            style={{
                                fontSize: isMobile ? '1rem' : '1.15rem',
                                padding: isMobile ? '16px 40px' : '18px 55px',
                                width: isMobile ? 'calc(100% - 40px)' : 'auto',
                                maxWidth: isMobile ? '400px' : 'none'
                            }}
                        >
                            Continue to Next Chapter →
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    pointerEvents: 'none',
                    zIndex: 20
                }}
            >
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '0 0 10px #d4576d, 0 0 20px #d4576d, 0 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '1px'
                }}>
                    SCROLL DOWN
                </div>
                <div style={{
                    fontSize: '2.5rem',
                    color: '#fff',
                    textShadow: '0 0 10px #d4576d, 0 0 20px #d4576d'
                }}>
                    ↓
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedMemory && (
                    <MemoryModal
                        memory={selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                        isMobile={isMobile}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Scene3_Memories;