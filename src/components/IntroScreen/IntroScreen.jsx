import { DIFFICULTY_LEVELS, DIFFICULTY_CONFIG, GAME_MESSAGES } from "../../utils/constants";
import './IntroScreen.css';

const IntroScreen = ({
    selectedDifficulty,
    highScores,
    onStartGame,
    onDifficultyChange
}) => {
    const handleDifficultySelect = (difficulty) => {
        onDifficultyChange(difficulty);
    };

    const handleStartGame = () => {
        if (selectedDifficulty) {
            onStartGame(selectedDifficulty);
        }
    };

    return (
      <div className="intro-screen">
        <header className="intro">
          <h1>Pokemon Memory Card Game</h1>
          <p className="welcome-message">{GAME_MESSAGES.WELCOME}</p>
          <p className="game-rules">{GAME_MESSAGES.GAME_RULES}</p>
        </header>

        <section className="high-scores-section">
          <h2>High Scores</h2>
          <div className="high-scores">
            <div className="score-item">
              <span>Easy: {highScores.easy}</span>
            </div>
            <div className="score-item">
              <span>Easy: {highScores.medium}</span>
            </div>
            <div className="score-item">
              <span>Easy: {highScores.hard}</span>
            </div>
          </div>
        </section>
        <section className="difficulty-selection">
          <h2>Select Difficulty</h2>
          <div className="difficulty-buttons">
            <button
              type="button"
              className={`difficulty-btn ${
                selectedDifficulty === DIFFICULTY_LEVELS.EASY ? "active" : ""
              }`}
              onClick={() => handleDifficultySelect(DIFFICULTY_LEVELS.EASY)}
              aria-label="Select Easy difficulty"
            >
              Easy
              <span className="difficulty-info">
                ({DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.EASY].pokemonCount}{" "}
                Pokemon)
              </span>
            </button>
            <button
              type="button"
              className={`difficulty-btn ${
                selectedDifficulty === DIFFICULTY_LEVELS.MEDIUM ? "active" : ""
              }`}
              onClick={() => handleDifficultySelect(DIFFICULTY_LEVELS.MEDIUM)}
              aria-label="Select Medium difficulty"
            >
              Medium
              <span className="difficulty-info">
                ({DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.MEDIUM].pokemonCount}{" "}
                Pokemon)
              </span>
            </button>
            <button
              type="button"
              className={`difficulty-btn ${
                selectedDifficulty === DIFFICULTY_LEVELS.HARD ? "active" : ""
              }`}
              onClick={() => handleDifficultySelect(DIFFICULTY_LEVELS.HARD)}
              aria-label="Select Hard difficulty"
            >
              Hard
              <span className="difficulty-info">
                ({DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.HARD].pokemonCount}{" "}
                Pokemon)
              </span>
            </button>
          </div>
        </section>
        <section className="game-start">
          <button
            type="button"
            className="start-game-btn"
            onClick={handleStartGame}
            disabled={!selectedDifficulty}
            title={
              !selectedDifficulty
                ? "Select a difficulty to start"
                : "Start Game"
            }
          >
            Start Game
          </button>
        </section>
      </div>
    );
};

export default IntroScreen;