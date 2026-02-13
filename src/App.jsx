import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import Scene1_Entry from './components/Scene1_Entry';
import Scene2_MiniGame from './components/Scene2_MiniGame';
import Scene3_Memories from './components/Scene3_Memories';
import Scene4_Proposal from './components/Scene4_Proposal';
import BackgroundMusic from './components/BackgroundMusic';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentScene, setCurrentScene] = useState(1);

    const handleLoadComplete = () => {
        setIsLoading(false);
    };

    const goToNextScene = () => {
        setCurrentScene((prev) => prev + 1);
    };

    // Smoother transition variants
    const pageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 1.02 }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.8
    };

    return (
        <>
            <CustomCursor />
            <BackgroundMusic />

            {isLoading ? (
                <LoadingScreen onLoadComplete={handleLoadComplete} />
            ) : (
                <AnimatePresence mode="wait">
                    {currentScene === 1 && (
                        <motion.div
                            key="scene1"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <Scene1_Entry onNext={goToNextScene} />
                        </motion.div>
                    )}

                    {currentScene === 2 && (
                        <motion.div
                            key="scene2"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <Scene2_MiniGame onNext={goToNextScene} />
                        </motion.div>
                    )}

                    {currentScene === 3 && (
                        <motion.div
                            key="scene3"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <Scene3_Memories onNext={goToNextScene} />
                        </motion.div>
                    )}

                    {currentScene === 4 && (
                        <motion.div
                            key="scene4"
                            initial="initial"
                            animate="in"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <Scene4_Proposal />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    );
}

export default App;
