import { useState, useEffect } from 'react';
import { shuffleArray, selectCardsForBoard } from '../../utils/gameLogic';
import Card from '../Card/Card';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { GAME_BOARD } from '../../utils/constants';
import './GameBoard.css';

const GameBoard = ({
    difficulty,
    onCardClick,
    gameStarted,
    pokemonPool,
    error,
    onRetry,
    shouldShuffle,
    shuffleKey,
    onShuffleComplete
}) => {
    const [currentCards, setCurrentCards] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(() => {
        if (pokemonPool && pokemonPool.length > 0) {
            const selectedCards = selectCardsForBoard(pokemonPool, GAME_BOARD.TOTAL_CARDS);
            const shuffledCards = shuffleArray(selectedCards);
            setCurrentCards(shuffledCards);
        }
    }, [pokemonPool, difficulty]);

    useEffect(() => {
        if (shouldShuffle && currentCards.length > 0) {
            setIsShuffling(true);

            setTimeout(() => {
                const shuffledCards = shuffleArray([...currentCards]);
                setCurrentCards(shuffledCards);

                setTimeout(() => {
                    setIsShuffling(false);
                    if (onShuffleComplete) onShuffleComplete();
                }, 300);
            }, 100);
        }
    }, [shouldShuffle, shuffleKey]);

    if (!gameStarted || !pokemonPool) {
        return (
            <div className="game-board-container">
                <LoadingSpinner />
                <p className='loading-message'>Loading Pokémon...</p>
            </div>
        );
    }

    if (error || pokemonPool.length === 0) {
        return (
            <div className="game-board-container error-state">
                <div className="error-message">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error || 'Failed to load Pokemon data'}</p>
                    {onRetry && (
                        <button
                        className='retry-button'
                        onClick={onRetry}
                        type='button'
                        >Retry</button>                    
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="game-board-container">
            <div 
            className={`game-board responsive-grid ${isShuffling ? 'shuffling' : ''}`}
            data-testid="game-board"
            >
                {currentCards.map((pokemon, index) => (
                    <Card
                        key={`${pokemon.id}-${shuffleKey || 0}-${index}`}
                        pokemon={pokemon}
                        onClick={() => onCardClick(pokemon)}
                        data-testid="pokemon-card"
                    />
                ))}
            </div>
        </div>
    );
};

export default GameBoard;