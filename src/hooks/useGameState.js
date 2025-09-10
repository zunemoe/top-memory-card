import { useState } from 'react'

export const useGameState = () => {
    const [gameState, setGameState] = useState('menu');
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    const handleStartGame = (difficulty) => {
        console.log('Starting game with difficulty:', difficulty);
    };

    return {
        gameState,
        selectedDifficulty,
        handleDifficultyChange,
        handleStartGame,        
    };
};