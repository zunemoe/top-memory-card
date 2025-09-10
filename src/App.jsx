import { useState } from 'react'
import IntroScreen from './components/IntroScreen/IntroScreen.jsx'
import { useGameState } from './hooks/useGameState.js';
import './styles/main.css'

function App() {
  const {
    gameState,
    selectedDifficulty,
    handleDifficultyChange,
    handleStartGame,        
  } = useGameState();

  const mockHighScores = {
    easy: 15,
    medium: 12,
    hard: 8,
  };

  const renderCurrentScreen = () => {
    switch (gameState) {
      case 'menu':
        return (
          <IntroScreen
            selectedDifficulty={selectedDifficulty}
            highScores={mockHighScores}
            onDifficultyChange={handleDifficultyChange}
            onStartGame={handleStartGame}
          />
        );
      default:
        return (
          <IntroScreen
            selectedDifficulty={selectedDifficulty}
            highScores={mockHighScores}
            onDifficultyChange={handleDifficultyChange}
            onStartGame={handleStartGame}
          />
        );
    }
  };

  return (
    <div className='App'>
      {renderCurrentScreen()}
    </div>
  )
}

export default App;
