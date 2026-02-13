import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ============================================
// GAME STATES
// ============================================
const GAME_STATES = {
    INTRO: 'INTRO',
    EXPLORING: 'EXPLORING',
    COLLECTING: 'COLLECTING',
    PROPOSAL: 'PROPOSAL',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const lerpColor = (color1, color2, t) => {
    return new THREE.Color().lerpColors(color1, color2, t);
};

const lerp = (start, end, t) => {
    return start + (end - start) * t;
};

// Create heart shape geometry
const createHeartShape = () => {
    const shape = new THREE.Shape();

    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

// ============================================
// CAMERA CONTROLLER
// ============================================
const CameraController = ({ heartCompletion }) => {
    useFrame((state) => {
        // Subtle floating camera
        state.camera.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

        // Adjust FOV based on completion
        state.camera.fov = lerp(60, 50, heartCompletion / 100);
        state.camera.updateProjectionMatrix();
    });
    return null;
};

// ============================================
// EMOTIONAL STATE CONTROLLER
// ============================================
const EmotionalStateController = ({ heartCompletion }) => {
    const { scene } = useThree();

    useFrame(() => {
        // Background color evolution
        const bgColor = lerpColor(
            new THREE.Color('#0a0015'),
            new THREE.Color('#2d0052'),
            heartCompletion / 100
        );
        scene.background = bgColor;
    });

    return null;
};

// ============================================
// TRANSPARENT HEART OUTLINE (GOAL INDICATOR)
// ============================================
const HeartOutline = ({ heartCompletion }) => {
    const heartGeometry = useMemo(() => createHeartShape(), []);

    return (
        <mesh scale={2.5} rotation={[0, 0, 0]}>
            <primitive object={heartGeometry} />
            <meshBasicMaterial
                color="#ff1493"
                transparent
                opacity={lerp(0.15, 0.05, heartCompletion / 100)}
                wireframe={false}
            />
        </mesh>
    );
};

// ============================================
// BROKEN HEART (CENTER PIECE)
// ============================================
const BrokenHeart = ({ heartCompletion, collectedFragments }) => {
    const groupRef = useRef();
    const heartGeometry = useMemo(() => createHeartShape(), []);

    useFrame((state) => {
        if (groupRef.current) {
            // Heartbeat animation
            const beat = Math.sin(state.clock.elapsedTime * lerp(0.5, 2.0, heartCompletion / 100));
            groupRef.current.scale.setScalar(2.5 + beat * 0.1);

            // Gentle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    // Create 5 heart fragments that snap into place
    const fragments = useMemo(() => {
        return [
            { id: 0, offset: [-0.3, 0.2, 0], rotation: [0, 0, -0.3] },
            { id: 1, offset: [0.3, 0.2, 0], rotation: [0, 0, 0.3] },
            { id: 2, offset: [-0.2, -0.3, 0], rotation: [0, 0, -0.2] },
            { id: 3, offset: [0.2, -0.3, 0], rotation: [0, 0, 0.2] },
            { id: 4, offset: [0, 0.4, 0], rotation: [0, 0, 0] }
        ];
    }, []);

    return (
        <group ref={groupRef}>
            {fragments.map((frag) => {
                const isCollected = collectedFragments.includes(frag.id);
                return (
                    <mesh
                        key={frag.id}
                        position={isCollected ? [0, 0, 0] : frag.offset}
                        rotation={isCollected ? [0, 0, 0] : frag.rotation}
                        scale={0.2}
                        visible={isCollected}
                    >
                        <primitive object={heartGeometry} />
                        <meshStandardMaterial
                            color="#ff1493"
                            emissive="#ff1493"
                            emissiveIntensity={2}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

// ============================================
// HEART FRAGMENT (COLLECTIBLE)
// ============================================
const HeartFragment = ({ position, id, onCollect, collected, isAnimating }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const heartGeometry = useMemo(() => createHeartShape(), []);
    const targetPosition = useRef(new THREE.Vector3(...position));

    useFrame((state) => {
        if (meshRef.current && !collected) {
            if (isAnimating) {
                // Animate to center
                meshRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
                meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, 0, 0.1);
                meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, 0, 0.1);
                meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, 0, 0.1);
            } else {
                // Gentle drift toward center
                const driftSpeed = 0.002;
                meshRef.current.position.lerp(new THREE.Vector3(0, 0, 0), driftSpeed);

                // Floating animation
                meshRef.current.position.y = targetPosition.current.y + Math.sin(state.clock.elapsedTime + id) * 0.3;

                // Gentle rotation
                meshRef.current.rotation.y += 0.01;
                meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + id) * 0.2;
            }
        }
    });

    if (collected && !isAnimating) return null;

    const handleClick = () => {
        if (!collected && !isAnimating) {
            onCollect(id);
        }
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={hovered ? 0.7 : 0.6}
        >
            <primitive object={heartGeometry} />
            <meshStandardMaterial
                color="#ff69b4"
                emissive="#ff69b4"
                emissiveIntensity={hovered ? 4 : 2.5}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
};

// ============================================
// MAIN 3D SCENE
// ============================================
const Scene3D = ({
    heartCompletion,
    fragments,
    onFragmentCollect,
    collectedFragments,
    animatingFragment
}) => {
    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <CameraController heartCompletion={heartCompletion} />
            <EmotionalStateController heartCompletion={heartCompletion} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#8B008B" />
            <pointLight position={[0, 0, 5]} intensity={1.5} color="#ff69b4" />

            {/* Transparent heart outline - shows the goal */}
            <HeartOutline heartCompletion={heartCompletion} />

            {/* Center heart - pieces snap into place */}
            <BrokenHeart heartCompletion={heartCompletion} collectedFragments={collectedFragments} />

            {/* Collectible fragments */}
            {fragments.map((frag) => (
                <HeartFragment
                    key={frag.id}
                    id={frag.id}
                    position={frag.position}
                    onCollect={onFragmentCollect}
                    collected={collectedFragments.includes(frag.id)}
                    isAnimating={animatingFragment === frag.id}
                />
            ))}
        </Canvas>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
const Scene2_HeartDimension = ({ onNext }) => {
    const [gameState, setGameState] = useState({
        phase: GAME_STATES.INTRO,
        fragmentsCollected: 0,
        heartCompletion: 0,
        collectedFragments: [],
        animatingFragment: null,
        showMessage: null
    });

    const [introStep, setIntroStep] = useState(0);

    // Fragment positions - spread around the heart
    const fragments = useMemo(() => [
        { id: 0, position: [4, 3, 0], message: "You make my world brighter ✨" },
        { id: 1, position: [-4, -3, 0], message: "Every moment with you is special 💫" },
        { id: 2, position: [3, -4, 0], message: "You are my favorite person 💖" },
        { id: 3, position: [-3, 4, 0], message: "Your smile lights up my day ☀️" },
        { id: 4, position: [0, -5, 0], message: "My heart is complete with you 💝" }
    ], []);

    // Intro sequence
    useEffect(() => {
        if (gameState.phase === GAME_STATES.INTRO) {
            const timers = [
                setTimeout(() => setIntroStep(1), 1000),
                setTimeout(() => setIntroStep(2), 3000),
                setTimeout(() => setIntroStep(3), 5000),
                setTimeout(() => setIntroStep(4), 7000)
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [gameState.phase]);

    const handleBegin = () => {
        setGameState(prev => ({ ...prev, phase: GAME_STATES.EXPLORING }));
    };

    const handleFragmentCollect = (id) => {
        if (gameState.collectedFragments.includes(id)) return;

        const fragment = fragments.find(f => f.id === id);

        // Start animation
        setGameState(prev => ({
            ...prev,
            phase: GAME_STATES.COLLECTING,
            animatingFragment: id,
            showMessage: fragment.message
        }));

        // After animation, add to collected
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                fragmentsCollected: prev.fragmentsCollected + 1,
                heartCompletion: (prev.fragmentsCollected + 1) * 20,
                collectedFragments: [...prev.collectedFragments, id],
                animatingFragment: null,
                showMessage: null,
                phase: prev.fragmentsCollected + 1 >= 5 ? GAME_STATES.PROPOSAL : GAME_STATES.EXPLORING
            }));
        }, 1500);
    };

    const handleYes = () => {
        setTimeout(() => onNext(), 1000);
    };

    return (
        <div className="scene gradient-bg-2">
            {/* 3D Scene */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }}>
                {gameState.phase !== GAME_STATES.INTRO && (
                    <Scene3D
                        heartCompletion={gameState.heartCompletion}
                        fragments={fragments}
                        onFragmentCollect={handleFragmentCollect}
                        collectedFragments={gameState.collectedFragments}
                        animatingFragment={gameState.animatingFragment}
                    />
                )}
            </div>

            {/* Clear Instruction at Top */}
            {(gameState.phase === GAME_STATES.EXPLORING || gameState.phase === GAME_STATES.COLLECTING) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        zIndex: 10,
                        textShadow: '0 0 20px #ff1493',
                        color: '#fff'
                    }}
                >
                    Restore the Heart
                </motion.div>
            )}

            {/* Progress Counter */}
            {(gameState.phase === GAME_STATES.EXPLORING || gameState.phase === GAME_STATES.COLLECTING) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: 'absolute',
                        top: '100px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        zIndex: 10,
                        color: '#ff69b4'
                    }}
                >
                    {gameState.fragmentsCollected} / 5 pieces
                </motion.div>
            )}

            {/* Instruction */}
            {gameState.phase === GAME_STATES.EXPLORING && gameState.fragmentsCollected === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        zIndex: 10,
                        textShadow: '0 0 10px #ff1493'
                    }}
                >
                    Click on the glowing heart pieces 💖
                </motion.div>
            )}

            {/* Intro Sequence */}
            <AnimatePresence>
                {gameState.phase === GAME_STATES.INTRO && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#000',
                            zIndex: 20
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {introStep >= 1 && (
                                <motion.h2
                                    key="text1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ fontSize: '2rem', marginBottom: '20px' }}
                                >
                                    Something is broken…
                                </motion.h2>
                            )}
                            {introStep >= 2 && (
                                <motion.h2
                                    key="text2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#ff1493' }}
                                >
                                    My heart.
                                </motion.h2>
                            )}
                            {introStep >= 3 && (
                                <motion.p
                                    key="text3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ fontSize: '1.5rem', marginBottom: '40px' }}
                                >
                                    Can you help me restore it?
                                </motion.p>
                            )}
                            {introStep >= 4 && (
                                <motion.button
                                    key="button"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={handleBegin}
                                    className="btn btn-primary"
                                >
                                    BEGIN
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Display */}
            <AnimatePresence>
                {gameState.showMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '2rem',
                            textAlign: 'center',
                            zIndex: 15,
                            textShadow: '0 0 20px #ff1493',
                            padding: '20px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '20px'
                        }}
                    >
                        {gameState.showMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proposal */}
            <AnimatePresence>
                {gameState.phase === GAME_STATES.PROPOSAL && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0, 0, 0, 0.8)',
                            zIndex: 20
                        }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ fontSize: '2rem', marginBottom: '20px' }}
                        >
                            You restored my heart.
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            style={{ fontSize: '2rem', marginBottom: '20px' }}
                        >
                            It was always yours.
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.5 }}
                            style={{ fontSize: '3rem', marginBottom: '40px', color: '#ff1493' }}
                        >
                            Will you be my Valentine?
                        </motion.h1>
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={handleYes}
                            className="btn btn-primary"
                            style={{ fontSize: '1.5rem', padding: '20px 60px' }}
                        >
                            YES 💖
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Scene2_HeartDimension;
