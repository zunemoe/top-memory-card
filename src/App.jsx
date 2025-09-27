import { useState, useEffect } from 'react'
import IntroScreen from './components/IntroScreen/IntroScreen.jsx'
import GameBoard from './components/GameBoard/GameBoard.jsx';
import { useGameState } from './hooks/useGameState.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { fetchMultiplePokemon } from './services/pokemonAPI.js';
import { generateRandomPokemonIds } from './utils/gameLogic.js';
import { DIFFICULTY_CONFIG, GAME_STATES } from './utils/constants.js';
import './styles/main.css'

function App() {
  const {
    gameState,
    selectedDifficulty,
    handleDifficultyChange,
    handleStartGame,        
    resetToMenu,
    setGameState
  } = useGameState();

  const [pokemonPool, setPokemonPool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [clickedPokemon, setClickedPokemon] = useState(new Set());
  const [currentScore, setCurrentScore] = useState(0);
  const [shouldShuffle, setShouldShuffle] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const [highScores, setHighScores] = useLocalStorage('pokemon-memory-game-high-scores', {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0
  });

  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && selectedDifficulty) {
      loadPokemonData();
      resetGameState();
    }
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

  const resetGameState = () => {
    setClickedPokemon(new Set());
    setCurrentScore(0);
    setShouldShuffle(false);
    setShuffleKey(0);
  };

  const handleCardClick = (pokemon) => {
    console.log('Card clicked:', pokemon.id);
    
    if (gameState !== GAME_STATES.PLAYING) return;

    if (clickedPokemon.has(pokemon.id)) {
      console.log('Pokemon already clicked, game over.');
      updateHighScores(currentScore);
      setGameState(GAME_STATES.GAME_OVER);
      return;
    }

    const newClickedPokemon = new Set(clickedPokemon);
    newClickedPokemon.add(pokemon.id);
    setClickedPokemon(newClickedPokemon);

    const newScore = currentScore + 1;
    setCurrentScore(newScore);

    const targetScore = DIFFICULTY_CONFIG[selectedDifficulty].maxScore;
    if (newClickedPokemon.size >= targetScore) {
      console.log('Victory! All unique Pokémon clicked.');
      updateHighScores(currentScore);
      setGameState(GAME_STATES.VICTORY);
      return;
    }

    setShouldShuffle(true);
    setShuffleKey(prevKey => prevKey + 1);
  };

  const updateHighScores = (score) => {
    const currentHighScore = highScores[selectedDifficulty] || 0;
    if (score > currentHighScore) {
      setHighScores(prev => ({
        ...prev,
        [selectedDifficulty]: score
      }));
    }
  };

  const handleShuffleComplete = () => {
    setShouldShuffle(false);
  };

  const handleRetry = () => {
    loadPokemonData();
  };

  const handleBackToMenu = () => {
    resetToMenu();
    resetGameState();
  };

  const handlePlayAgain = () => {
    resetGameState();
    handleStartGame(selectedDifficulty);
  };

  const renderCurrentScreen = () => {
    switch (gameState) {
      case GAME_STATES.MENU:
        return (
          <IntroScreen
            selectedDifficulty={selectedDifficulty}
            highScores={highScores}
            onDifficultyChange={handleDifficultyChange}
            onStartGame={handleStartGame}
          />
        );
      case GAME_STATES.PLAYING:
        return (
          <div className="game-container">
            <div className="game-header">
              <button onClick={handleBackToMenu} className="back-to-menu-btn">
                Back to Menu
              </button>
              <h2 className="game-high-score">High Score: {highScores[selectedDifficulty]}</h2>
              <h2 className="game-score">Current Score: {currentScore}</h2>
              <p className="game-board-difficulty">Difficulty: {DIFFICULTY_CONFIG[selectedDifficulty]?.label}</p>
            </div>
            <GameBoard
              difficulty={selectedDifficulty}
              onCardClick={handleCardClick}
              pokemonPool={pokemonPool}
              gameStarted={!loading && !error}
              error={error}
              onRetry={handleRetry}
              shouldShuffle={shouldShuffle}
              shuffleKey={shuffleKey}
              onShuffleComplete={handleShuffleComplete}
            />  
          </div>          
        );
      case GAME_STATES.GAME_OVER:
        return (
          <div className="game-over-container">
            <h2 className="game-over">Game Over!</h2>
            <h2 className="game-high-score">High Score: {highScores[selectedDifficulty]}</h2>
            <h2 className="game-score">Current Score: {currentScore}</h2>
            <button onClick={handleBackToMenu} className="back-to-menu-btn">
              Back to Menu
            </button>
            <button onClick={handlePlayAgain} className="play-again-btn">
              Play Again
            </button>
          </div>
        );
      case GAME_STATES.VICTORY:
        return (
          <div className="victory-container">
            <h2 className="victory">Congratulations! You won!</h2>
            <button onClick={handleBackToMenu} className="back-to-menu-btn">
              Back to Menu
            </button>
            <button onClick={handlePlayAgain} className="play-again-btn">
              Play Again
            </button>
          </div>
        );
      default:
        return (
          <IntroScreen
            selectedDifficulty={selectedDifficulty}
            highScores={highScores}
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
