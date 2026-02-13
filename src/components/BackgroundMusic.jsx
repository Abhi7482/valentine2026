import React, { useEffect, useRef, useState } from 'react';

const BackgroundMusic = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Create audio element
        const audio = new Audio("https://actions.google.com/sounds/v1/ambiences/piano_bar.ogg");
        // Using a reliable Google Actions sound for demo purposes (Piano Bar - Soft piano)
        // Ideally the user would replace this with their own file.

        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        // Try to play automatically
        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                console.log("Audio autoplay blocked, waiting for interaction");
            }
        };

        // Add click listener to start audio if blocked
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.log(e));
                setIsPlaying(true);
            }
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);

        playAudio();

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            opacity: 0.7,
            cursor: 'pointer'
        }}
            onClick={() => {
                if (audioRef.current) {
                    if (isPlaying) audioRef.current.pause();
                    else audioRef.current.play();
                    setIsPlaying(!isPlaying);
                }
            }}>
            {isPlaying ? '🔊' : '🔇'}
        </div>
    );
};

export default BackgroundMusic;
