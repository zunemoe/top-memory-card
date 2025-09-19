import { useState } from 'react'

export const useGameState = () => {
    const [gameState, setGameState] = useState('menu');
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    const handleStartGame = (difficulty) => {
        console.log('Starting game with difficulty:', difficulty);
        setGameState('playing');
        setSelectedDifficulty(difficulty);
    };

    const resetToMenu = () => {
        setGameState('menu');
        setSelectedDifficulty(null);
    };

    const handleGameOver = () => {
        setGameState('game-over');
    };

    const handleVictory = () => {
        setGameState('victory');
    };

    return {
        gameState,
        setGameState,
        selectedDifficulty,
        handleDifficultyChange,
        handleStartGame,  
        resetToMenu,
        handleGameOver,
        handleVictory      
    };
};