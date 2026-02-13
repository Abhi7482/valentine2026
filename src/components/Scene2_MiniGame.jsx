import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';

// ============================================
// CONFIGURATION
// ============================================
const LEVEL_LENGTH = 2500;
const GRAVITY = 0.5;
const JUMP_FORCE = -11;
const SPEED = 5;

// Memory Items - More romantic and varied
const MEMORY_ITEMS = [
    { x: 400, y: 150, type: 'firstdate', text: "Our first date... ✨", icon: "🌹" },
    { x: 800, y: 120, type: 'music', text: "Dancing to our song... 🎶", icon: "🎵" },
    { x: 1200, y: 160, type: 'laughter', text: "Your beautiful laugh... 😊", icon: "💫" },
    { x: 1600, y: 130, type: 'dreams', text: "Building our dreams... 🌠", icon: "💭" },
    { x: 1950, y: 140, type: 'forever', text: "Forever with you... 💕", icon: "💌" }
];

// ============================================
// ENHANCED CHARACTER COMPONENT
// ============================================
import Character from './Character';
import { FloatingHearts, Sparkles } from './ParticleEffects';

// ============================================
// OPTIMIZED BACKGROUND
// ============================================

// Static configurations to prevent re-creation on every render
const STARS_CONFIG = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    delay: i * 0.3
}));

const CLOUDS_CONFIG = [
    { x: 10, y: 15, size: 100 }, { x: 40, y: 25, size: 80 },
    { x: 70, y: 10, size: 120 }, { x: 120, y: 20, size: 90 },
    { x: 180, y: 18, size: 110 }
];

const TREES_CONFIG = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${i * 300 + 50}px`,
    fontSize: `${40 + Math.random() * 40}px`
}));

const Background = React.memo(({ cameraX, progress }) => {
    const skyGradient = `linear-gradient(to bottom, 
        hsl(${200 + progress * 40}, 70%, ${60 + progress * 15}%) 0%, 
        hsl(${340 + progress * 20}, 85%, ${75 + progress * 15}%) 100%)`;

    return (
        <>
            {/* Animated Sky */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: skyGradient, transition: 'background 2s ease', willChange: 'background'
            }}>
                {/* Stars - Only render when dark enough */}
                {progress > 0.3 && (
                    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        {STARS_CONFIG.map((star) => (
                            <motion.div
                                key={star.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    left: star.left,
                                    top: star.top,
                                    fontSize: '20px'
                                }}
                            >⭐</motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sun/Moon */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: `${20 - progress * 10}%`,
                    fontSize: '80px',
                    filter: 'drop-shadow(0 0 20px rgba(255,200,100,0.5))', // Reduced shadow radius for perf
                    transform: `translateX(-${cameraX * 0.02}px)`,
                    willChange: 'transform'
                }}
            >
                {progress < 0.5 ? '☀️' : '🌙'}
            </motion.div>

            {/* Clouds - Far Background */}
            <div style={{
                position: 'absolute', width: '100%', height: '100%',
                transform: `translateX(-${cameraX * 0.1}px)`,
                willChange: 'transform'
            }}>
                {CLOUDS_CONFIG.map((cloud, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute', left: `${cloud.x}%`, top: `${cloud.y}%`,
                            fontSize: `${cloud.size}px`, opacity: 0.7, filter: 'blur(1px)'
                        }}
                    >☁️</motion.div>
                ))}
            </div>

            {/* Hills - Far */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
                transform: `translateX(-${cameraX * 0.2}px)`,
                willChange: 'transform'
            }}>
                <svg width="200%" height="100%" style={{ position: 'absolute', bottom: 0 }}>
                    <path d="M0 100 Q 25 40 50 80 T 100 60 T 150 90 T 200 100 V 200 H 0 Z" fill="#7ec8a3" opacity="0.6" />
                </svg>
            </div>

            {/* Trees - Mid Ground (Faster Parallax) */}
            <div style={{
                position: 'absolute', bottom: '15%', left: 0, width: '100%', height: '100%',
                transform: `translateX(-${cameraX * 0.5}px)`, pointerEvents: 'none',
                willChange: 'transform'
            }}>
                {TREES_CONFIG.map((tree) => (
                    <div key={tree.id} style={{
                        position: 'absolute',
                        left: tree.left,
                        bottom: '0',
                        fontSize: tree.fontSize,
                        opacity: 0.8,
                        filter: 'blur(0.5px)'
                    }}>🌲</div>
                ))}
            </div>
        </>
    );
});

// ... (Rest of imports and configs)

// ============================================
// MAIN GAME COMPONENT
// ============================================
const ImprovedValentineGame = ({ onNext }) => {
    // ... (State definitions remain same)
    const [gameState, setGameState] = useState('INTRO');
    const [player, setPlayer] = useState({ x: 100, y: 250, vy: 0, grounded: false, facing: 'right', scaleY: 1 });
    const [cameraX, setCameraX] = useState(0);
    const [collected, setCollected] = useState([]);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [cinematicText, setCinematicText] = useState("");
    const [showInstructions, setShowInstructions] = useState(true);

    const keys = useRef({});
    const reqRef = useRef();
    const playerRef = useRef(player);
    const stateRef = useRef(gameState);

    useEffect(() => { stateRef.current = gameState; }, [gameState]);
    useEffect(() => { playerRef.current = player; }, [player]);

    // ... (Update loop remains same)
    const update = () => {
        if (stateRef.current === 'PROPOSAL' || stateRef.current === 'WON') return;

        let { x, y, vy, grounded, facing, scaleY } = playerRef.current;

        if (scaleY !== 1) {
            scaleY = scaleY + (1 - scaleY) * 0.15;
            if (Math.abs(1 - scaleY) < 0.01) scaleY = 1;
        }

        if (stateRef.current === 'CUTSCENE') {
            const targetX = LEVEL_LENGTH - 200;
            if (x < targetX) {
                x += SPEED * 0.5;
                facing = 'right';
                if (grounded && Math.random() > 0.97) {
                    vy = JUMP_FORCE * 0.5;
                    grounded = false;
                    scaleY = 1.25;
                }
            } else {
                setGameState('PROPOSAL_SEQUENCE');
            }
        }
        else if (stateRef.current === 'PLAYING') {
            if (keys.current['ArrowRight'] || keys.current['KeyD']) {
                x += SPEED;
                facing = 'right';
                setShowInstructions(false);
            }
            if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
                x -= SPEED;
                facing = 'left';
                setShowInstructions(false);
            }
            if ((keys.current['ArrowUp'] || keys.current['Space'] || keys.current['KeyW']) && grounded) {
                vy = JUMP_FORCE;
                grounded = false;
                scaleY = 1.35;
                setShowInstructions(false);
            }
        }

        vy += GRAVITY;
        y += vy;

        if (y > 250) {
            if (!grounded) scaleY = 0.65;
            y = 250;
            vy = 0;
            grounded = true;
        }

        x = Math.max(0, Math.min(LEVEL_LENGTH, x));

        playerRef.current = { x, y, vy, grounded, facing, scaleY };
        setPlayer({ x, y, vy, grounded, facing, scaleY });

        setCameraX(prev => {
            const target = Math.max(0, x - window.innerWidth / 2.5);
            return prev + (target - prev) * 0.08;
        });

        if (stateRef.current === 'PLAYING' && x > LEVEL_LENGTH - 400) {
            setGameState('CUTSCENE');
        }

        reqRef.current = requestAnimationFrame(update);
    };

    // ... (Effects remain same)
    useEffect(() => {
        if (gameState !== 'PLAYING' && gameState !== 'CUTSCENE') return;
        const interval = setInterval(() => {
            const { x, y } = playerRef.current;
            MEMORY_ITEMS.forEach(item => {
                if (!collected.includes(item.type)) {
                    const dist = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
                    if (dist < 70) {
                        setCollected(prev => [...prev, item.type]);
                        const id = Math.random();
                        setFloatingTexts(prev => [...prev, { id, text: item.text, x: item.x, y: item.y - 50 }]);
                        setTimeout(() => setFloatingTexts(prev => prev.filter(p => p.id !== id)), 3500);
                    }
                }
            });
        }, 100);
        return () => clearInterval(interval);
    }, [gameState, collected]);

    useEffect(() => {
        const d = (e) => {
            keys.current[e.code] = true;
            if (gameState === 'INTRO' && (e.code === 'Space' || e.code === 'Enter')) {
                setGameState('PLAYING');
            }
        };
        const u = (e) => keys.current[e.code] = false;
        window.addEventListener('keydown', d);
        window.addEventListener('keyup', u);
        reqRef.current = requestAnimationFrame(update);
        return () => {
            window.removeEventListener('keydown', d);
            window.removeEventListener('keyup', u);
            cancelAnimationFrame(reqRef.current);
        };
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'PROPOSAL_SEQUENCE') {
            const runSequence = async () => {
                setCinematicText("Every step I took...");
                await new Promise(r => setTimeout(r, 2500));
                setCinematicText("Every moment we shared...");
                await new Promise(r => setTimeout(r, 2500));
                setCinematicText("Led me to you. 💕");
                await new Promise(r => setTimeout(r, 3000));
                setCinematicText("");
                await new Promise(r => setTimeout(r, 800));
                setGameState('PROPOSAL_MODAL');
            };
            runSequence();
        }
    }, [gameState]);

    const progress = Math.min(1, player.x / (LEVEL_LENGTH - 200));
    const worldSaturation = Math.min(100, progress * 120);
    const partnerOpacity = Math.max(0.15, Math.min(1, progress * 1.8));

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#000', overflow: 'hidden', fontFamily: "'Quicksand', sans-serif"
        }}>
            {/* World */}
            <div style={{
                position: 'absolute', width: '100%', height: '100%',
                filter: `saturate(${worldSaturation}%) brightness(${0.8 + progress * 0.3})`,
                transition: 'filter 1s ease'
            }}>
                <Background cameraX={cameraX} progress={progress} />

                {/* Play area */}
                <div style={{
                    position: 'absolute', width: '100%', height: '100%',
                    transform: `translateX(-${cameraX}px)`
                }}>
                    {/* Enhanced Ground */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0,
                        width: `${LEVEL_LENGTH + 1000}px`, height: 'calc(100% - 300px)',
                        background: 'linear-gradient(to bottom, #86c58c 0%, #68b074 100%)',
                        borderTop: '12px solid #5fa068',
                        borderRadius: '100px 100px 0 0' // Rounded hill look
                    }}>
                        {/* Grass pattern overlay */}
                        <div style={{
                            width: '100%', height: '20px',
                            backgroundImage: 'radial-gradient(#4d8c56 15%, transparent 16%)',
                            backgroundSize: '20px 20px', opacity: 0.3
                        }} />
                    </div>

                    {[
                        { x: 150, icon: '🌷', size: 40 }, { x: 300, icon: '�', size: 45 },
                        { x: 550, icon: '🌻', size: 50 }, { x: 750, icon: '🌹', size: 42 },
                        { x: 1000, icon: '🌸', size: 48 }, { x: 1300, icon: '💐', size: 55 },
                        { x: 1550, icon: '🌼', size: 43 }, { x: 1800, icon: '🌺', size: 47 },
                        { x: 2100, icon: '🌷', size: 52 }
                    ].map((deco, i) => (
                        <motion.div
                            key={i}
                            animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
                            transition={{ duration: 3 + i % 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: 'absolute', left: deco.x, bottom: 'calc(100% - 305px)',
                                fontSize: `${deco.size}px`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}
                        >{deco.icon}</motion.div>
                    ))}

                    {/* Collectible memories */}
                    {MEMORY_ITEMS.map((item, i) => !collected.includes(item.type) && (
                        <motion.div
                            key={item.type}
                            animate={{ y: [0, -20, 0], rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                            style={{
                                position: 'absolute', left: item.x, top: item.y,
                                fontSize: '50px', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
                                zIndex: 5, cursor: 'pointer'
                            }}
                        >{item.icon}</motion.div>
                    ))}

                    {/* Partner character */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute', left: LEVEL_LENGTH - 150, top: 190,
                            opacity: partnerOpacity, transition: 'opacity 1.5s ease', zIndex: 10
                        }}
                    >
                        <Character color="#ff69b4" isPartner={true} facing="left" />
                    </motion.div>

                    {/* Player character */}
                    <div style={{ position: 'absolute', left: player.x, top: player.y, zIndex: 10 }}>
                        <Character color="#00d4ff" scaleY={player.scaleY} facing={player.facing} />
                    </div>

                    {/* Hearts connecting */}
                    {progress > 0.85 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                            transition={{ opacity: { duration: 1 }, scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
                            style={{
                                position: 'absolute', left: LEVEL_LENGTH - 180, top: 160,
                                fontSize: '60px', zIndex: 15, filter: 'drop-shadow(0 0 10px rgba(255,105,180,0.8))'
                            }}
                        >💖</motion.div>
                    )}
                </div>

                <FloatingHearts count={10} />
                <Sparkles count={20} />
            </div>

            {/* UI Layer */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 100
            }}>
                {/* Glassy Progress Bar */}
                {gameState === 'PLAYING' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                            width: '300px', height: '12px', background: 'rgba(255,255,255,0.1)',
                            borderRadius: '10px', overflow: 'hidden', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <motion.div
                            animate={{ width: `${progress * 100}%` }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #ff6b9d, #ffa3c1)', borderRadius: '10px' }}
                        />
                    </motion.div>
                )}

                {/* Glassy Collection Counter */}
                {gameState === 'PLAYING' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass"
                        style={{
                            position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)',
                            padding: '8px 20px', borderRadius: '20px',
                            color: 'white', fontSize: '15px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <span>Memories:</span>
                        <span style={{ color: '#ff6b9d' }}>{collected.length}</span>
                        <span>/</span>
                        <span>{MEMORY_ITEMS.length}</span>
                        <span>💕</span>
                    </motion.div>
                )}

                {/* Instructions */}
                {gameState === 'PLAYING' && showInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            bottom: '30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0,0,0,0.6)',
                            padding: '15px 30px',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '16px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        Use Arrow Keys or WASD to move • Space to jump
                    </motion.div>
                )}

                {/* Intro screen */}
                <AnimatePresence>
                    {gameState === 'INTRO' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle at center, rgba(255,105,180,0.2), rgba(0,0,0,0.8))',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'auto'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                style={{
                                    textAlign: 'center',
                                    maxWidth: '600px',
                                    padding: '40px'
                                }}
                            >
                                <motion.h1
                                    animate={{
                                        textShadow: [
                                            '0 0 20px rgba(255,105,180,0.5)',
                                            '0 0 40px rgba(255,105,180,0.8)',
                                            '0 0 20px rgba(255,105,180,0.5)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{
                                        fontSize: '3.5rem',
                                        color: '#fff',
                                        marginBottom: '20px',
                                        fontWeight: '700',
                                        lineHeight: 1.2
                                    }}
                                >
                                    A Journey to You 💕
                                </motion.h1>
                                <p style={{
                                    fontSize: '1.3rem',
                                    color: 'rgba(255,255,255,0.9)',
                                    marginBottom: '40px',
                                    lineHeight: 1.6
                                }}>
                                    Collect our precious memories<br />
                                    and find your way to my heart
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setGameState('PLAYING')}
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '18px 50px',
                                        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        boxShadow: '0 10px 30px rgba(255,107,157,0.4)',
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    Begin Journey ✨
                                </motion.button>
                                <p style={{
                                    marginTop: '20px',
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.6)'
                                }}>
                                    Press Space or Enter to start
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating memory texts */}
                <AnimatePresence>
                    {floatingTexts.map(ft => (
                        <motion.div
                            key={ft.id}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 1, 0], y: -100, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3.5, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                left: Math.min(window.innerWidth - 350, Math.max(20, ft.x - cameraX)),
                                top: ft.y,
                                color: '#fff',
                                fontSize: '1.6rem',
                                fontWeight: '600',
                                textShadow: '0 0 20px rgba(255,105,180,0.8), 0 2px 10px rgba(0,0,0,0.3)',
                                background: 'rgba(255,255,255,0.15)',
                                padding: '12px 28px',
                                borderRadius: '30px',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255,255,255,0.3)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {ft.text}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Cinematic text */}
                <AnimatePresence>
                    {cinematicText && (
                        <motion.div
                            key={cinematicText}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 1.2 }}
                            style={{
                                position: 'absolute',
                                top: '40%',
                                width: '100%',
                                textAlign: 'center',
                                fontSize: '3rem',
                                color: '#fff',
                                fontWeight: '700',
                                textShadow: '0 0 40px rgba(255,105,180,0.9), 0 0 20px rgba(255,182,193,0.6)',
                                padding: '0 20px',
                                lineHeight: 1.4
                            }}
                        >
                            {cinematicText}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Proposal Modal */}
                <AnimatePresence>
                    {gameState === 'PROPOSAL_MODAL' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle at center, rgba(255,182,193,0.3), rgba(20,5,30,0.85))',
                                backdropFilter: 'blur(12px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'auto'
                            }}
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 1, type: "spring" }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,240,245,0.95))',
                                    padding: '60px',
                                    borderRadius: '30px',
                                    textAlign: 'center',
                                    maxWidth: '650px',
                                    width: '90%',
                                    boxShadow: '0 30px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.8) inset',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Decorative hearts */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '-20px',
                                    fontSize: '40px',
                                    opacity: 0.3
                                }}>💕</div>
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    fontSize: '35px',
                                    opacity: 0.3
                                }}>💖</div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '45px',
                                    opacity: 0.3
                                }}>💝</div>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        fontSize: '80px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    💐
                                </motion.div>

                                <h2 style={{
                                    fontSize: '1.1rem',
                                    color: '#ff69b4',
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px',
                                    marginBottom: '15px',
                                    fontWeight: '600'
                                }}>
                                    For My Beautiful Dino Hands
                                </h2>

                                <h1 style={{
                                    fontSize: '3.2rem',
                                    background: 'linear-gradient(135deg, #ff6b9d, #ff1493)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    margin: '25px 0',
                                    fontWeight: '700',
                                    lineHeight: 1.2
                                }}>
                                    Will you be my<br />Valentine? 💕
                                </h1>

                                <p style={{
                                    fontSize: '1.1rem',
                                    color: '#666',
                                    marginBottom: '35px',
                                    lineHeight: 1.6
                                }}>
                                    You make every day feel like the best day.<br />
                                    I can't imagine my world without you in it.
                                </p>

                                <div style={{
                                    display: 'flex',
                                    gap: '15px',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(255,107,157,0.5)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('WON')}
                                        style={{
                                            fontSize: '1.8rem',
                                            padding: '20px 55px',
                                            background: 'linear-gradient(135deg, #ff6b9d, #ff1493)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            boxShadow: '0 10px 30px rgba(255,107,157,0.4)',
                                            pointerEvents: 'auto'
                                        }}
                                    >
                                        YES! 💖
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, background: '#ffd1dc' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('WON')}
                                        style={{
                                            fontSize: '1.5rem',
                                            padding: '20px 45px',
                                            background: '#ffe6f0',
                                            color: '#ff69b4',
                                            border: '2px solid #ff69b4',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            pointerEvents: 'auto',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        ABSOLUTELY! 💕
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Win Screen */}
                {gameState === 'WON' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ff69b4 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <ConfettiExplosion
                                force={0.8}
                                duration={5000}
                                particleCount={300}
                                width={2000}
                            />
                        </div>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                            style={{
                                textAlign: 'center',
                                maxWidth: '900px',
                                padding: '40px'
                            }}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    fontSize: '120px',
                                    marginBottom: '30px'
                                }}
                            >
                                🎉💕✨
                            </motion.div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    fontSize: '4rem',
                                    color: '#fff',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    marginBottom: '20px',
                                    fontWeight: '700',
                                    lineHeight: 1.3
                                }}
                            >
                                You just made me the<br />
                                happiest person alive! 💖
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                style={{
                                    fontSize: '1.8rem',
                                    color: 'rgba(255,255,255,0.95)',
                                    marginBottom: '50px',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                I can't wait to make more beautiful memories with you
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                style={{
                                    marginTop: '60px',
                                    fontSize: '1.2rem',
                                    color: 'white',
                                    fontWeight: '600',
                                    opacity: 0.8
                                }}
                            >
                                Made with all my love, for you. 🌹
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ImprovedValentineGame;