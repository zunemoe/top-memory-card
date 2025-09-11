import { useState } from 'react'
import IntroScreen from './components/IntroScreen/IntroScreen.jsx'
import GameBoard from './components/GameBoard/GameBoard.jsx';
import { useGameState } from './hooks/useGameState.js';
import { fetchMultiplePokemon } from './services/pokemonAPI.js';
import { generateRandomPokemonIds } from './utils/gameLogic.js';
import { DIFFICULTY_CONFIG, GAME_STATES } from './utils/constants.js';
import './styles/main.css'
import { useEffect } from 'react';

function App() {
  const {
    gameState,
    selectedDifficulty,
    handleDifficultyChange,
    handleStartGame,        
    resetToMenu
  } = useGameState();

  const [pokemonPool, setPokemonPool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockHighScores = {
    easy: 15,
    medium: 12,
    hard: 8,
  };

  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && selectedDifficulty) loadPokemonData();
  }, [gameState, selectedDifficulty]);

  const loadPokemonData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pokemonCount = DIFFICULTY_CONFIG[selectedDifficulty].pokemonCount;
      const randomIds = generateRandomPokemonIds(pokemonCount);
      const pokemonData = await fetchMultiplePokemon(randomIds);

      setPokemonPool(pokemonData);
    } catch (err) {
      console.error('Error loading Pokémon data:', err);
      setError('Failed to load Pokémon data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (pokemonId) => {
    console.log('Card clicked:', pokemonId);
    // Implement game logic for card click
  };

  const handleRetry = () => {
    loadPokemonData();
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
      case 'playing':
        return (
          <div className="game-container">
            <div className="game-header">
              <button onClick={resetToMenu} className="back-to-menu-btn">
                Back to Menu
              </button>
              <h2>Score: 0</h2>
              <p>Difficulty: {DIFFICULTY_CONFIG[selectedDifficulty]?.label}</p>
            </div>
            <GameBoard
              difficulty={selectedDifficulty}
              onCardClick={handleCardClick}
              pokemonPool={pokemonPool}
              gameStarted={!loading && !error}
              error={error}
              onRetry={handleRetry}
            />  
          </div>          
        );
      case 'game-over':
        return (
          <div className="game-over-container">
            <h2>Game Over!</h2>
            <button onClick={resetToMenu} className="back-to-menu-btn">
              Back to Menu
            </button>
          </div>
        );
      case 'victory':
        return (
          <div className="victory-container">
            <h2>Congratulations! You won!</h2>
            <button onClick={resetToMenu} className="back-to-menu-btn">
              Back to Menu
            </button>
          </div>
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
