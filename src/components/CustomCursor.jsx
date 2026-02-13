import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('interactive')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    mixBlendMode: 'screen',
                }}
                animate={{
                    x: mousePosition.x - 6,
                    y: mousePosition.y - 6,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 500,
                    mass: 0.5,
                }}
            />

            {/* Glow ring */}
            <motion.div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid var(--primary)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: 0.5,
                }}
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isHovering ? 1.8 : 1,
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 200,
                    mass: 0.8,
                }}
            />
        </>
    );
};

export default CustomCursor;
