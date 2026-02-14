import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';

// Configuration
const LEVEL_LENGTH = 4000;
const GRAVITY = 0.55;
const JUMP_FORCE = -13.5;
const SPEED = 5.5;
const DOUBLE_JUMP_FORCE = -11;

// Memory collectibles - better spaced
const MEMORY_ITEMS = [
    { x: 600, y: 160, type: 'firstdate', text: "Our first date", icon: "💕", points: 100 },
    { x: 1100, y: 140, type: 'music', text: "Dancing together", icon: "🎵", points: 100 },
    { x: 1650, y: 180, type: 'laughter', text: "Your beautiful laugh", icon: "😊", points: 100 },
    { x: 2200, y: 150, type: 'dreams', text: "Building our dreams", icon: "✨", points: 100 },
    { x: 2800, y: 170, type: 'adventure', text: "Our adventures", icon: "🌟", points: 100 },
    { x: 3300, y: 140, type: 'forever', text: "Forever with you", icon: "💖", points: 150 }
];

// Power-ups
const POWER_UPS = [
    { x: 800, y: 200, type: 'speed', icon: "⚡", duration: 6000 },
    { x: 1900, y: 190, type: 'jump', icon: "🦘", duration: 8000 },
    { x: 3000, y: 200, type: 'invincible', icon: "✨", duration: 5000 }
];

// Improved obstacles with proper collision boxes
const OBSTACLES = [
    { x: 950, y: 250, width: 45, height: 30, type: 'rock', icon: "🪨", canJumpOver: true },
    { x: 1400, y: 250, width: 70, height: 30, type: 'bush', icon: "🌿", canJumpOver: true },
    { x: 1850, y: 250, width: 55, height: 32, type: 'rock', icon: "🪨", canJumpOver: true },
    { x: 2400, y: 250, width: 90, height: 25, type: 'puddle', icon: "💧", canJumpOver: true },
    { x: 2650, y: 250, width: 50, height: 35, type: 'rock', icon: "🪨", canJumpOver: true },
    { x: 3200, y: 250, width: 75, height: 32, type: 'bush', icon: "🌿", canJumpOver: true }
];

// Platforms for extra challenge
const PLATFORMS = [
    { x: 1250, y: 180, width: 120, height: 15 },
    { x: 2050, y: 160, width: 100, height: 15 },
    { x: 2900, y: 170, width: 130, height: 15 }
];

// Floating hearts - more of them!
const BONUS_HEARTS = Array.from({ length: 25 }, (_, i) => ({
    x: 350 + i * 150,
    y: 100 + Math.sin(i * 0.5) * 40,
    type: 'heart',
    icon: "♥",
    points: 20
}));

import Character from './Character';

const Background = React.memo(({ cameraX, progress }) => {
    const hue1 = 200 + progress * 40;
    const hue2 = 340 + progress * 30;
    const sat1 = 65 - progress * 10;
    const sat2 = 75 - progress * 10;
    const light1 = 78 - progress * 25;
    const light2 = 87 - progress * 20;

    const skyGradient = `linear-gradient(to bottom, 
        hsl(${hue1}, ${sat1}%, ${light1}%) 0%, 
        hsl(${hue2}, ${sat2}%, ${light2}%) 100%)`;

    return (
        <>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: skyGradient, transition: 'background 3s ease'
            }} />

            {/* Animated sun/moon */}
            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute', top: '10%', right: `${25 - progress * 12}%`,
                    fontSize: '85px',
                    filter: `drop-shadow(0 0 ${25 + progress * 25}px ${progress < 0.5 ? 'rgba(255,200,100,0.7)' : 'rgba(200,220,255,0.5)'})`,
                    transform: `translateX(-${cameraX * 0.02}px)`,
                    zIndex: 1
                }}
            >
                {progress < 0.5 ? '☀' : '☾'}
            </motion.div>

            {/* Mountains in background */}
            <div style={{
                position: 'absolute', bottom: '30%', left: 0, width: '100%',
                transform: `translateX(-${cameraX * 0.15}px)`
            }}>
                <svg width="200%" height="200" style={{ position: 'absolute', bottom: 0 }}>
                    <path d="M0 200 L100 100 L200 150 L300 80 L400 130 L500 200 Z" fill="rgba(150, 180, 150, 0.3)" />
                </svg>
            </div>
        </>
    );
});

const ImprovedValentineGame = ({ onNext }) => {
    const [gameState, setGameState] = useState('INTRO');
    const [player, setPlayer] = useState({
        x: 100, y: 250, vy: 0, grounded: false, facing: 'right', scaleY: 1,
        canDoubleJump: true, jumpsLeft: 2
    });
    const [cameraX, setCameraX] = useState(0);
    const [collected, setCollected] = useState([]);
    const [collectedHearts, setCollectedHearts] = useState([]);
    const [collectedPowerUps, setCollectedPowerUps] = useState([]);
    const [activePowerUps, setActivePowerUps] = useState([]);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [lives, setLives] = useState(5);
    const [cinematicText, setCinematicText] = useState("");
    const [showInstructions, setShowInstructions] = useState(true);
    const [hitCooldown, setHitCooldown] = useState(false);

    const keys = useRef({});
    const reqRef = useRef();
    const playerRef = useRef(player);
    const stateRef = useRef(gameState);
    const comboTimer = useRef(null);
    const lastHitTime = useRef(0);

    useEffect(() => { stateRef.current = gameState; }, [gameState]);
    useEffect(() => { playerRef.current = player; }, [player]);

    const addCombo = () => {
        setCombo(prev => prev + 1);
        if (comboTimer.current) clearTimeout(comboTimer.current);
        comboTimer.current = setTimeout(() => setCombo(0), 3000);
    };

    const addFloatingText = (text, x, y, color = '#d4576d') => {
        const id = Math.random();
        setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
        setTimeout(() => setFloatingTexts(prev => prev.filter(p => p.id !== id)), 2500);
    };

    const takeDamage = (x, y) => {
        if (hitCooldown || activePowerUps.some(p => p.type === 'invincible')) return;

        setHitCooldown(true);
        setLives(prev => Math.max(0, prev - 1));
        setCombo(0);
        addFloatingText("Ouch! -1 Life 💔", x, y, '#ff0000');

        // Invincibility frames (2 seconds)
        setTimeout(() => setHitCooldown(false), 2000);
    };

    const update = () => {
        if (stateRef.current === 'PROPOSAL' || stateRef.current === 'WON' || stateRef.current === 'GAMEOVER') return;

        let { x, y, vy, grounded, facing, scaleY, canDoubleJump, jumpsLeft } = playerRef.current;

        if (scaleY !== 1) {
            scaleY = scaleY + (1 - scaleY) * 0.15;
            if (Math.abs(1 - scaleY) < 0.01) scaleY = 1;
        }

        const hasSpeedBoost = activePowerUps.some(p => p.type === 'speed');
        const hasJumpBoost = activePowerUps.some(p => p.type === 'jump');
        const hasInvincible = activePowerUps.some(p => p.type === 'invincible');

        const currentSpeed = hasSpeedBoost ? SPEED * 1.6 : SPEED;
        const currentJumpForce = hasJumpBoost ? JUMP_FORCE * 1.4 : JUMP_FORCE;

        if (stateRef.current === 'CUTSCENE') {
            const targetX = LEVEL_LENGTH - 200;
            if (x < targetX) {
                x += currentSpeed * 0.6;
                facing = 'right';
                if (grounded && Math.random() > 0.97) {
                    vy = currentJumpForce * 0.5;
                    grounded = false;
                    scaleY = 1.25;
                }
            } else {
                setGameState('PROPOSAL_SEQUENCE');
            }
        }
        else if (stateRef.current === 'PLAYING') {
            let moveX = 0;

            if (keys.current['ArrowRight'] || keys.current['KeyD']) {
                moveX = currentSpeed;
                facing = 'right';
                setShowInstructions(false);
            }
            if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
                moveX = -currentSpeed * 0.7;
                facing = 'left';
                setShowInstructions(false);
            }

            // Jump logic
            if ((keys.current['ArrowUp'] || keys.current['Space'] || keys.current['KeyW'])) {
                if (grounded && jumpsLeft > 0) {
                    vy = currentJumpForce;
                    grounded = false;
                    scaleY = 1.5;
                    jumpsLeft = 1;
                    setShowInstructions(false);
                } else if (!grounded && canDoubleJump && jumpsLeft > 0) {
                    vy = DOUBLE_JUMP_FORCE;
                    canDoubleJump = false;
                    jumpsLeft = 0;
                    scaleY = 1.35;
                    addFloatingText("Double Jump! ✨", x, y - 30, '#ffd700');
                }
            }

            x += moveX;
        }

        vy += GRAVITY;
        y += vy;

        // Ground collision
        if (y > 250) {
            if (!grounded) scaleY = 0.7;
            y = 250;
            vy = 0;
            grounded = true;
            canDoubleJump = true;
            jumpsLeft = 2;
        } else {
            grounded = false;
        }

        // Platform collision
        PLATFORMS.forEach(platform => {
            const playerBottom = y + 60;
            const playerRight = x + 50;
            const playerLeft = x + 10;
            const playerCenterX = x + 30;

            const platformTop = platform.y;
            const platformBottom = platform.y + platform.height;
            const platformLeft = platform.x;
            const platformRight = platform.x + platform.width;

            // Landing on platform from above
            if (vy > 0 &&
                playerBottom >= platformTop &&
                playerBottom <= platformBottom &&
                playerRight > platformLeft &&
                playerLeft < platformRight) {

                y = platformTop - 60;
                vy = 0;
                grounded = true;
                canDoubleJump = true;
                jumpsLeft = 2;
                if (scaleY !== 1) scaleY = 0.7;
            }
        });

        x = Math.max(0, Math.min(LEVEL_LENGTH, x));

        playerRef.current = { x, y, vy, grounded, facing, scaleY, canDoubleJump, jumpsLeft };
        setPlayer({ x, y, vy, grounded, facing, scaleY, canDoubleJump, jumpsLeft });

        setCameraX(prev => {
            const target = Math.max(0, x - window.innerWidth / 2.5);
            return prev + (target - prev) * 0.1;
        });

        if (stateRef.current === 'PLAYING' && x > LEVEL_LENGTH - 400) {
            setGameState('CUTSCENE');
        }

        reqRef.current = requestAnimationFrame(update);
    };

    // Collection and collision detection
    useEffect(() => {
        if (gameState !== 'PLAYING' && gameState !== 'CUTSCENE') return;

        const interval = setInterval(() => {
            const { x, y } = playerRef.current;
            const hasMagnet = activePowerUps.some(p => p.type === 'invincible'); // Invincible also acts as magnet
            const magnetRange = hasMagnet ? 120 : 70;

            // Collect memories
            MEMORY_ITEMS.forEach(item => {
                if (!collected.includes(item.type)) {
                    const dist = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
                    if (dist < magnetRange) {
                        setCollected(prev => [...prev, item.type]);
                        const bonusPoints = Math.floor(item.points * (1 + combo * 0.3));
                        setScore(prev => prev + bonusPoints);
                        addCombo();
                        addFloatingText(`${item.text} +${bonusPoints}`, item.x, item.y - 50);
                    }
                }
            });

            // Collect hearts
            BONUS_HEARTS.forEach((heart, idx) => {
                if (!collectedHearts.includes(idx)) {
                    const dist = Math.sqrt(Math.pow(x - heart.x, 2) + Math.pow(y - heart.y, 2));
                    if (dist < magnetRange) {
                        setCollectedHearts(prev => [...prev, idx]);
                        const bonusPoints = heart.points + (combo > 5 ? 10 : 0);
                        setScore(prev => prev + bonusPoints);
                        addCombo();

                        if (combo > 0 && combo % 10 === 0) {
                            addFloatingText(`${combo}x MEGA COMBO! 🔥`, x, y - 60, '#ff6b00');
                        }
                    }
                }
            });

            // Collect power-ups
            POWER_UPS.forEach((powerup, idx) => {
                if (!collectedPowerUps.includes(idx)) {
                    const dist = Math.sqrt(Math.pow(x - powerup.x, 2) + Math.pow(y - powerup.y, 2));
                    if (dist < 70) {
                        setCollectedPowerUps(prev => [...prev, idx]);
                        const newPowerUp = { ...powerup, startTime: Date.now() };
                        setActivePowerUps(prev => [...prev.filter(p => p.type !== powerup.type), newPowerUp]);

                        const powerUpNames = {
                            speed: 'Speed Boost',
                            jump: 'Super Jump',
                            invincible: 'Invincible'
                        };
                        addFloatingText(`${powerUpNames[powerup.type]}! ${powerup.icon}`, powerup.x, powerup.y - 50, '#4CAF50');

                        setTimeout(() => {
                            setActivePowerUps(prev => prev.filter(p => p.type !== powerup.type));
                        }, powerup.duration);
                    }
                }
            });

            // Obstacle collision - FIXED!
            if (!hitCooldown && !activePowerUps.some(p => p.type === 'invincible')) {
                const playerBottom = y + 60;
                const playerTop = y + 10;
                const playerRight = x + 50;
                const playerLeft = x + 10;

                OBSTACLES.forEach(obstacle => {
                    const obstacleTop = obstacle.y - obstacle.height;
                    const obstacleBottom = obstacle.y;
                    const obstacleLeft = obstacle.x;
                    const obstacleRight = obstacle.x + obstacle.width;

                    // Check if player overlaps with obstacle
                    const isOverlapping =
                        playerRight > obstacleLeft &&
                        playerLeft < obstacleRight &&
                        playerBottom > obstacleTop &&
                        playerTop < obstacleBottom;

                    if (isOverlapping) {
                        // Successfully jumped over if player's bottom is above obstacle top
                        if (playerBottom < obstacleTop + 20) {
                            return; // No collision - jumped over!
                        }

                        // Hit the obstacle
                        takeDamage(x, y);
                        // Push player back
                        playerRef.current.x = Math.max(0, x - 80);
                        playerRef.current.vy = -5; // Small bounce
                    }
                });
            }

        }, 50);

        return () => clearInterval(interval);
    }, [gameState, collected, collectedHearts, collectedPowerUps, activePowerUps, combo, hitCooldown]);

    useEffect(() => {
        if (lives <= 0 && gameState === 'PLAYING') {
            setGameState('GAMEOVER');
        }
    }, [lives]);

    useEffect(() => {
        const d = (e) => {
            keys.current[e.code] = true;
            if (gameState === 'INTRO' && (e.code === 'Space' || e.code === 'Enter')) {
                setGameState('PLAYING');
            }
            if (gameState === 'GAMEOVER' && e.code === 'KeyR') {
                window.location.reload();
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
                setCinematicText("Led me to you");
                await new Promise(r => setTimeout(r, 3000));
                setCinematicText("");
                await new Promise(r => setTimeout(r, 800));
                setGameState('PROPOSAL_MODAL');
            };
            runSequence();
        }
    }, [gameState]);

    const progress = Math.min(1, player.x / (LEVEL_LENGTH - 200));
    const partnerOpacity = Math.max(0.15, Math.min(1, progress * 1.8));

    return (
        <div className="scene" style={{ background: '#fdfbfb' }}>
            <div style={{
                position: 'absolute', width: '100%', height: '100%',
                filter: `saturate(${Math.min(115, 85 + progress * 30)}%) brightness(${1 - progress * 0.12})`,
                transition: 'filter 2s ease'
            }}>
                <Background cameraX={cameraX} progress={progress} />

                <div style={{
                    position: 'absolute', width: '100%', height: '100%',
                    transform: `translateX(-${cameraX}px)`
                }}>
                    {/* Ground */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0,
                        width: `${LEVEL_LENGTH + 1000}px`, height: 'calc(100% - 300px)',
                        background: 'linear-gradient(to bottom, #a8d4a8 0%, #88b888 100%)',
                        borderTop: '12px solid #6fa06f',
                        borderRadius: '120px 120px 0 0',
                        boxShadow: 'inset 0 15px 30px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{
                            width: '100%', height: '25px',
                            backgroundImage: 'radial-gradient(circle, #5a8a5a 15%, transparent 16%)',
                            backgroundSize: '22px 22px', opacity: 0.3
                        }} />
                    </div>

                    {/* Platforms */}
                    {PLATFORMS.map((platform, idx) => (
                        <div
                            key={`platform-${idx}`}
                            style={{
                                position: 'absolute',
                                left: platform.x,
                                top: platform.y,
                                width: platform.width,
                                height: platform.height,
                                background: 'linear-gradient(to bottom, #8b7355, #6b5845)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
                                border: '2px solid #5a4835'
                            }}
                        />
                    ))}

                    {/* Collectible memories */}
                    {MEMORY_ITEMS.map((item, i) => !collected.includes(item.type) && (
                        <motion.div
                            key={item.type}
                            animate={{
                                y: [0, -22, 0],
                                scale: [1, 1.15, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                            style={{
                                position: 'absolute', left: item.x, top: item.y,
                                fontSize: '60px',
                                filter: 'drop-shadow(0 0 35px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 15px rgba(255, 105, 180, 0.6))',
                                zIndex: 5
                            }}
                        >
                            {item.icon}
                        </motion.div>
                    ))}

                    {/* Bonus hearts */}
                    {BONUS_HEARTS.map((heart, idx) => !collectedHearts.includes(idx) && (
                        <motion.div
                            key={idx}
                            animate={{ y: [heart.y, heart.y - 12, heart.y], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.1 }}
                            style={{
                                position: 'absolute', left: heart.x, top: heart.y,
                                fontSize: '32px', color: '#ff69b4',
                                filter: 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.8))',
                                zIndex: 4
                            }}
                        >
                            {heart.icon}
                        </motion.div>
                    ))}

                    {/* Power-ups */}
                    {POWER_UPS.map((powerup, idx) => !collectedPowerUps.includes(idx) && (
                        <motion.div
                            key={powerup.type}
                            animate={{
                                y: [0, -18, 0],
                                rotate: [0, 15, -15, 0],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            style={{
                                position: 'absolute', left: powerup.x, top: powerup.y,
                                fontSize: '60px',
                                filter: 'drop-shadow(0 0 35px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 15px rgba(255, 105, 180, 0.6))',
                                zIndex: 5
                            }}
                        >
                            {powerup.icon}
                        </motion.div>
                    ))}

                    {/* Obstacles - Better visualization */}
                    {OBSTACLES.map((obstacle, idx) => (
                        <div
                            key={idx}
                            style={{
                                position: 'absolute',
                                left: obstacle.x,
                                top: obstacle.y - obstacle.height,
                                width: obstacle.width,
                                height: obstacle.height,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: `${obstacle.height}px`,
                                filter: 'drop-shadow(0 0 12px rgba(255, 50, 50, 0.7)) drop-shadow(0 4px 4px rgba(0,0,0,0.4))',
                                zIndex: 3
                            }}
                        >
                            {obstacle.icon}
                        </div>
                    ))}

                    {/* Partner */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity }}
                        style={{
                            position: 'absolute', left: LEVEL_LENGTH - 150, top: 190,
                            opacity: partnerOpacity, zIndex: 10,
                            filter: progress > 0.8 ? 'drop-shadow(0 0 20px rgba(212, 87, 109, 0.6))' : 'none'
                        }}
                    >
                        <Character color="#d4576d" isPartner={true} facing="left" />
                    </motion.div>

                    {/* Player */}
                    <div style={{
                        position: 'absolute', left: player.x, top: player.y, zIndex: 10,
                        filter: hitCooldown
                            ? 'drop-shadow(0 0 15px rgba(255, 0, 0, 0.8))'
                            : activePowerUps.some(p => p.type === 'invincible')
                                ? 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))'
                                : 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))',
                        opacity: hitCooldown ? 0.6 : 1,
                        transition: 'opacity 0.1s'
                    }}>
                        {activePowerUps.length > 0 && (
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                                style={{
                                    position: 'absolute', top: '-25px', left: '50%',
                                    transform: 'translateX(-50%)', fontSize: '35px'
                                }}
                            >
                                {activePowerUps[0].icon}
                            </motion.div>
                        )}
                        <Character color="#5a9aa0" scaleY={player.scaleY} facing={player.facing} />
                    </div>

                    {/* Hearts connecting */}
                    {progress > 0.88 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
                            transition={{
                                opacity: { duration: 1 },
                                scale: { duration: 1.6, repeat: Infinity },
                                rotate: { duration: 2.2, repeat: Infinity }
                            }}
                            style={{
                                position: 'absolute', left: LEVEL_LENGTH - 180, top: 155,
                                fontSize: '60px', color: '#d4576d', zIndex: 15,
                                filter: 'drop-shadow(0 0 20px rgba(212, 87, 109, 0.9))'
                            }}
                        >♥</motion.div>
                    )}
                </div>
            </div>

            {/* Enhanced UI */}
            <div className="scene-content-full" style={{ pointerEvents: 'none', zIndex: 100 }}>
                {/* Top HUD */}
                {gameState === 'PLAYING' && (
                    <div style={{
                        position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                        maxWidth: '95vw'
                    }}>
                        {/* Score & Combo */}
                        <motion.div
                            className="glass"
                            style={{
                                padding: '10px 28px', borderRadius: '25px',
                                fontSize: '1.15rem', fontWeight: '700',
                                display: 'flex', gap: '18px', alignItems: 'center',
                                boxShadow: '0 6px 20px rgba(212, 87, 109, 0.15)'
                            }}
                        >
                            <span>Score: <span style={{ color: '#d4576d', fontSize: '1.3rem' }}>{Math.floor(score)}</span></span>
                            {combo > 1 && (
                                <motion.span
                                    initial={{ scale: 1.4 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        color: combo > 10 ? '#ff4500' : '#ff6b00',
                                        fontSize: '1.2rem',
                                        fontWeight: '800'
                                    }}
                                >
                                    {combo}x {combo > 10 ? '🔥' : '✨'}
                                </motion.span>
                            )}
                        </motion.div>

                        {/* Progress & Lives */}
                        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {/* Progress */}
                            <div className="glass" style={{
                                width: 'clamp(200px, 35vw, 300px)', height: '12px', borderRadius: '6px',
                                overflow: 'hidden', padding: '2px'
                            }}>
                                <motion.div
                                    animate={{ width: `${progress * 100}%` }}
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #ff6b9d, #d4576d, #ff1493)',
                                        borderRadius: '6px',
                                        boxShadow: '0 0 12px rgba(212, 87, 109, 0.6)',
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </div>

                            {/* Lives */}
                            <div className="glass" style={{
                                padding: '6px 16px', borderRadius: '20px',
                                display: 'flex', gap: '6px', alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', marginRight: '4px' }}>Lives:</span>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            scale: i < lives ? [1, 1.15, 1] : 1,
                                            opacity: i < lives ? 1 : 0.25
                                        }}
                                        transition={{ duration: 0.6, repeat: i < lives ? Infinity : 0 }}
                                        style={{
                                            fontSize: '26px',
                                            filter: i < lives ? 'drop-shadow(0 0 6px rgba(255, 0, 0, 0.6))' : 'grayscale(100%)'
                                        }}
                                    >
                                        ❤️
                                    </motion.span>
                                ))}
                            </div>

                            {/* Memory counter */}
                            <div className="glass" style={{
                                padding: '6px 18px', borderRadius: '18px',
                                fontSize: '0.95rem', fontWeight: '600'
                            }}>
                                💕 {collected.length}/{MEMORY_ITEMS.length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {gameState === 'PLAYING' && showInstructions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass"
                        style={{
                            position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)',
                            padding: '16px 35px', borderRadius: '30px',
                            textAlign: 'center', maxWidth: '90vw',
                            boxShadow: '0 8px 25px rgba(212, 87, 109, 0.2)'
                        }}
                    >
                        <div style={{ fontWeight: '700', marginBottom: '6px', fontSize: '1.05rem' }}>
                            ⌨️ Arrow Keys/WASD to Move • Space to Jump
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                            Press jump in air for DOUBLE JUMP! • Collect 💕 memories & ♥ hearts • Avoid obstacles!
                        </div>
                    </motion.div>
                )}

                {/* Floating texts */}
                <AnimatePresence>
                    {floatingTexts.map(ft => (
                        <motion.div
                            key={ft.id}
                            initial={{ opacity: 0, y: 25, scale: 0.7 }}
                            animate={{ opacity: [0, 1, 1, 0.8, 0], y: -110, scale: [0.7, 1, 1, 1, 0.9] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                left: Math.min(window.innerWidth - 350, Math.max(15, ft.x - cameraX)),
                                top: ft.y,
                                color: ft.color || '#2c1810',
                                fontSize: '1.4rem',
                                fontWeight: '800',
                                background: 'rgba(255,255,255,0.97)',
                                padding: '12px 28px',
                                borderRadius: '25px',
                                boxShadow: `0 8px 25px ${ft.color}50`,
                                whiteSpace: 'nowrap',
                                border: `2px solid ${ft.color}60`
                            }}
                        >
                            {ft.text}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Game Over */}
                <AnimatePresence>
                    {gameState === 'GAMEOVER' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="scene-content"
                            style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.7, y: 60 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ type: "spring", bounce: 0.4 }}
                                className="modal-card"
                                style={{ maxWidth: '600px' }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    style={{ fontSize: '5rem', marginBottom: '25px' }}
                                >
                                    💔
                                </motion.div>
                                <h1 className="text-headline" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '25px', color: '#ff4444' }}>
                                    Game Over
                                </h1>
                                <div style={{ fontSize: '1.3rem', marginBottom: '15px', fontWeight: '600' }}>
                                    Final Score: <span style={{ color: '#d4576d', fontSize: '1.6rem' }}>{Math.floor(score)}</span>
                                </div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '35px', opacity: 0.9 }}>
                                    Memories Collected: {collected.length}/{MEMORY_ITEMS.length} • Hearts: {collectedHearts.length}/{BONUS_HEARTS.length}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(212, 87, 109, 0.4)' }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => window.location.reload()}
                                    className="btn btn-primary"
                                    style={{ pointerEvents: 'auto', fontSize: '1.3rem', padding: '18px 55px' }}
                                >
                                    🔄 Try Again
                                </motion.button>
                                <p style={{ marginTop: '20px', fontSize: '0.95rem', opacity: 0.7 }}>
                                    Press R to restart
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Intro */}
                <AnimatePresence>
                    {gameState === 'INTRO' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="scene-content"
                            style={{ pointerEvents: 'auto', background: 'rgba(253, 251, 251, 0.97)', backdropFilter: 'blur(12px)' }}
                        >
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.9 }}
                                className="modal-card"
                                style={{ maxWidth: '700px' }}
                            >
                                <div className="text-date" style={{ marginBottom: '22px' }}>
                                    An Interactive Love Journey
                                </div>
                                <h1 className="text-headline" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', marginBottom: '25px' }}>
                                    A Journey to You
                                </h1>
                                <div className="divider" style={{ margin: '35px auto' }} />
                                <p className="text-subheadline" style={{ fontSize: '1.35rem', marginBottom: '25px', lineHeight: '1.75' }}>
                                    Collect our precious memories 💕<br />
                                    Gather bonus hearts ♥ for points<br />
                                    Avoid obstacles along the way<br />
                                    Find your way to my heart
                                </p>
                                <div style={{
                                    background: 'rgba(212, 87, 109, 0.08)',
                                    padding: '20px 25px',
                                    borderRadius: '15px',
                                    marginBottom: '45px',
                                    border: '2px solid rgba(212, 87, 109, 0.2)'
                                }}>
                                    <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                                        Collect all 12 memories to reach her!
                                    </div>

                                    {/* Legend - Added for Clarity */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '20px',
                                        marginBottom: '20px',
                                        background: 'rgba(255,255,255,0.4)',
                                        padding: '10px 20px',
                                        borderRadius: '15px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px gold)' }}>💕</span>
                                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Collect</span>
                                        </div>
                                        <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px red)' }}>🪨</span>
                                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Avoid</span>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '30px' }}>
                                        ⚡ Power-Ups: Speed boost, Super jump, Invincibility<br />
                                        🦘 Double Jump: Press jump in mid-air<br />
                                        🏆 Combo System: Chain collections for bonus points<br />
                                        ❤️ 3 Lives: Avoid obstacles or restart!
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.06, boxShadow: '0 12px 45px rgba(212, 87, 109, 0.35)' }}
                                    whileTap={{ scale: 0.94 }}
                                    onClick={() => setGameState('PLAYING')}
                                    className="btn btn-primary"
                                    style={{ pointerEvents: 'auto', fontSize: '1.3rem', padding: '20px 60px', marginBottom: '20px' }}
                                >
                                    🚀 Begin Journey
                                </motion.button>
                                <p className="text-byline" style={{ fontSize: '0.9rem' }}>
                                    Press Space or Enter to start
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Cinematic text */}
                <AnimatePresence>
                    {cinematicText && (
                        <motion.div
                            key={cinematicText}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 1.3 }}
                            className="text-headline"
                            style={{
                                position: 'absolute', top: '38%', width: '100%', textAlign: 'center',
                                fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontStyle: 'italic',
                                textShadow: '0 6px 25px rgba(0,0,0,0.15)', padding: '0 25px'
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
                            transition={{ duration: 1.6 }}
                            className="scene-content"
                            style={{ pointerEvents: 'auto', background: 'rgba(253, 251, 251, 0.97)', backdropFilter: 'blur(12px)' }}
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.85 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.3 }}
                                className="modal-card"
                                style={{ maxWidth: '750px' }}
                            >
                                <div className="text-date" style={{ marginBottom: '28px' }}>
                                    For My Dino Hands
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.18, 1], rotate: [0, 6, -6, 0] }}
                                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ fontSize: '80px', marginBottom: '35px', color: '#d4576d', filter: 'drop-shadow(0 5px 15px rgba(212, 87, 109, 0.4))' }}
                                >
                                    ❀
                                </motion.div>
                                <h1 className="text-headline" style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', margin: '28px 0', lineHeight: '1.15' }}>
                                    Will you be my<br />Valentine?
                                </h1>
                                <div className="divider" style={{ margin: '38px auto', width: '100px' }} />
                                <div style={{ fontSize: '1.25rem', marginBottom: '15px', fontWeight: '600', color: '#d4576d' }}>
                                    Your Epic Score: {Math.floor(score)} points! 🎉
                                </div>
                                <p className="text-subheadline" style={{ fontSize: '1.3rem', marginBottom: '50px', lineHeight: '1.85' }}>
                                    You make every day feel like the best day.<br />
                                    I can't imagine my world without you in it.
                                </p>
                                <div style={{ display: 'flex', gap: '22px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.06, boxShadow: '0 12px 45px rgba(212, 87, 109, 0.45)' }}
                                        whileTap={{ scale: 0.94 }}
                                        onClick={() => setGameState('WON')}
                                        className="btn btn-primary"
                                        style={{ pointerEvents: 'auto', fontSize: '1.5rem', padding: '22px 70px' }}
                                    >
                                        Yes! ♥
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.06, background: '#e8c5c5' }}
                                        whileTap={{ scale: 0.94 }}
                                        onClick={() => setGameState('WON')}
                                        className="btn"
                                        style={{
                                            background: '#f5e8e8', color: '#d4576d', border: '2px solid #d4576d',
                                            pointerEvents: 'auto', fontSize: '1.5rem', padding: '22px 70px'
                                        }}
                                    >
                                        Absolutely! 💕
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
                        className="scene gradient-bg-1"
                        style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <ConfettiExplosion force={0.8} duration={5000} particleCount={300} width={2000} colors={['#d4576d', '#ff6b9d', '#f5a3a3', '#ffd700', '#fff']} />
                        </div>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, type: "spring", bounce: 0.35 }}
                            className="modal-card-success"
                            style={{ maxWidth: '900px' }}
                        >
                            <div className="text-date" style={{ marginBottom: '32px', fontSize: '1rem' }}>
                                She Said Yes! 🎉 • Champion Score: {Math.floor(score)}
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 12, -12, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                                style={{ fontSize: '100px', marginBottom: '40px', color: '#d4576d', filter: 'drop-shadow(0 6px 20px rgba(212, 87, 109, 0.5))' }}
                            >
                                ♥
                            </motion.div>
                            <h1 className="text-headline" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '30px', lineHeight: '1.15' }}>
                                You just made me the<br />
                                happiest person alive!
                            </h1>
                            <div className="divider" style={{ margin: '40px auto', width: '120px' }} />
                            <p className="text-subheadline" style={{ fontSize: '1.5rem', marginBottom: '50px', lineHeight: '1.85' }}>
                                I can't wait to make more beautiful memories with you
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.06, boxShadow: '0 14px 50px rgba(212, 87, 109, 0.4)' }}
                                whileTap={{ scale: 0.94 }}
                                onClick={onNext}
                                className="btn btn-primary"
                                style={{ pointerEvents: 'auto', marginBottom: '40px', fontSize: '1.3rem', padding: '20px 60px' }}
                            >
                                Continue Our Journey →
                            </motion.button>
                            <div className="text-byline" style={{ paddingTop: '38px', borderTop: '2px solid #f0e8e8', fontSize: '1.05rem' }}>
                                Made with all my love, for you 🌹
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ImprovedValentineGame;