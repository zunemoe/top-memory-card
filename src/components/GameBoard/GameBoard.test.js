import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GameBoard from './GameBoard';
import { DIFFICULTY_LEVELS } from '../../utils/constants';
import * as pokemonAPI from '../../services/pokemonAPI';
import * as gameLogic from '../../utils/gameLogic';

jest.mock('../../services/pokemonAPI');
const mockPokemonAPI = pokemonAPI;

describe('GameBoard', () => {
    const mockOnCardClick = jest.fn();
    const mockPokemonData = [
        { id: 1, name: 'bulbasaur', sprite: 'bulbasaur.png', types: ['grass'] },
        { id: 2, name: 'ivysaur', sprite: 'ivysaur.png', types: ['grass'] },
        { id: 3, name: 'venusaur', sprite: 'venusaur.png', types: ['grass'] },
        { id: 4, name: 'charmander', sprite: 'charmander.png', types: ['fire'] },
        { id: 5, name: 'charmeleon', sprite: 'charmeleon.png', types: ['fire'] },
        { id: 6, name: 'charizard', sprite: 'charizard.png', types: ['fire'] },
        { id: 7, name: 'squirtle', sprite: 'squirtle.png', types: ['water'] },
        { id: 8, name: 'wartortle', sprite: 'wartortle.png', types: ['water'] },
        { id: 9, name: 'blastoise', sprite: 'blastoise.png', types: ['water'] },
        { id: 10, name: 'caterpie', sprite: 'caterpie.png', types: ['bug'] },
        { id: 11, name: 'metapod', sprite: 'metapod.png', types: ['bug'] },
        { id: 12, name: 'butterfree', sprite: 'butterfree.png', types: ['bug'] },
        { id: 13, name: 'weedle', sprite: 'weedle.png', types: ['bug'] },
        { id: 14, name: 'kakuna', sprite: 'kakuna.png', types: ['bug'] },
        { id: 15, name: 'beedrill', sprite: 'beedrill.png', types: ['bug'] },
        { id: 16, name: 'pidgey', sprite: 'pidgey.png', types: ['normal'] },
        { id: 17, name: 'pidgeotto', sprite: 'pidgeotto.png', types: ['normal'] },
        { id: 18, name: 'pidgeot', sprite: 'pidgeot.png', types: ['normal'] },
        { id: 19, name: 'rattata', sprite: 'rattata.png', types: ['normal'] },
        { id: 20, name: 'raticate', sprite: 'raticate.png', types: ['normal'] }
    ];

    const defaultProps = {
        difficulty: DIFFICULTY_LEVELS.EASY,
        onCardClick: mockOnCardClick,
        gameStarted: true,
        pokemonPool: mockPokemonData
    };

    beforeEach(() => {
        jest.clearAllMocks();        
    });

    describe('Grid Layout', () => {
        test('renders exactly 12 cards in proper grid layout for EASY difficulty', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const cards = screen.getAllByTestId('pokemon-card');
                expect(cards).toHaveLength(12);
            });
        });  
    });

    describe('Pokemon Card Display', () => {
        test('each card shows Pokemon sprite and name', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const pokemonNames = screen.getAllByTestId('pokemon-name');
                const pokemonSprites = screen.getAllByTestId('pokemon-sprite');

                expect(pokemonNames.length).toBe(12);
                expect(pokemonSprites.length).toBe(12);

                pokemonSprites.forEach((sprite) => {
                    expect(sprite).toHaveAttribute('src');
                    expect(sprite).toHaveAttribute('alt');
                    expect(sprite.getAttribute('alt')).toBeTruthy();
                });
            });
        });

        test('cards have unique Pokemon without duplicates', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const pokemonNames = screen.getAllByTestId('pokemon-name');
                const displayedNames = pokemonNames.map(nameEl => nameEl.textContent);
                const uniqueNames = new Set(displayedNames);

                expect(uniqueNames.size).toBe(12);
                expect(displayedNames.length).toBe(12);
            });
        });

        test('cards are randomly selected from Pokemon pool', async () => {
            const { rerender } = render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getAllByTestId('pokemon-card').length).toBe(12);
            });
            const firstRenderPokemon = screen.getAllByTestId('pokemon-name').map(el => el.textContent);

            rerender(<GameBoard {...defaultProps} key="new-game" />);

            await waitFor(() => {
                const secondRenderPokemon = screen.getAllByTestId('pokemon-name').map(el => el.textContent);

                secondRenderPokemon.forEach(name => {
                    const isValidPokemon = mockPokemonData.some(p => p.name === name);
                    expect(isValidPokemon).toBe(true);
                });
            });
        });
    });

    describe('Loading State', () => {
        test('shows loading spinner while Pokemon data is being fetched', () => {
            const loadingProps = {
                ...defaultProps,
                pokemonPool: null,
                gameStarted: false
            };
            render(<GameBoard {...loadingProps} />);

            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
        });

        test('hides loading when data is ready', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
                expect(screen.getByTestId('game-board')).toBeInTheDocument();
            });
        });

        test('shows loading message', () => {
            const loadingProps = {
                ...defaultProps,
                pokemonPool: null,
                gameStarted: false
                
            };
            render(<GameBoard {...loadingProps} />);

            expect(screen.getByText(/Loading Pokémon.../i)).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        test('shows error message when Pokemon data is empty', () => {
            const errorProps = {
                ...defaultProps,
                pokemonPool: [],
                error: 'Failed to load Pokémon data.'
            };

            render(<GameBoard {...errorProps} />);

            expect(screen.getByText(/Failed to load Pokémon data./i)).toBeInTheDocument();
            expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
        });
    });

    describe('Card Interaction', () => {
        test('cards are clickable and have proper event handlers', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const cards = screen.getAllByTestId('pokemon-card');
                expect(cards.length).toBe(12);              
            });

            const firstCard = screen.getAllByTestId('pokemon-card')[0];
            fireEvent.click(firstCard);

            expect(mockOnCardClick).toHaveBeenCalledTimes(1);
        });

        test('click triggers callback with correct Pokemon data', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const cards = screen.getAllByTestId('pokemon-card');
                expect(cards.length).toBe(12);              
            });

            const firstCard = screen.getAllByTestId('pokemon-card')[0];
            fireEvent.click(firstCard);

            expect(mockOnCardClick).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    sprite: expect.any(String),
                    types: expect.any(Array)
                })
            );
        });

        test('click events work with keyboard interaction', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const cards = screen.getAllByTestId('pokemon-card');
                expect(cards.length).toBe(12);              
            });

            const firstCard = screen.getAllByTestId('pokemon-card')[0];

            fireEvent.keyDown(firstCard, { key: 'Enter' });
            expect(mockOnCardClick).toHaveBeenCalledTimes(1);

            fireEvent.keyDown(firstCard, { key: ' ' });
            expect(mockOnCardClick).toHaveBeenCalledTimes(2);
        });

        test('cards have accessibility attributes', async () => {
            render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                const cards = screen.getAllByTestId('pokemon-card');

                cards.forEach(card => {
                    expect(card).toHaveAttribute('aria-label');
                    expect(card.getAttribute('aria-label')).toMatch(/click.*pokemon/i);
                });
            });
        });
    });

    describe('Shuffle Mechanics', () => {
        test('cards are shuffled after each click', async () => {
            const { rerender } = render(<GameBoard {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getAllByTestId('pokemon-card').length).toBe(12);
            });

            const initialCards = screen.getAllByTestId('pokemon-name');
            const initialOrder = initialCards.map(card => card.textContent);

            rerender(<GameBoard {...defaultProps} shouldShuffle={true} shuffleKey={1} />);

            await waitFor(() => {
                const shuffledCards = screen.getAllByTestId('pokemon-name');
                const shuffledOrder = shuffledCards.map(card => card.textContent);
                expect(shuffledOrder).not.toEqual(initialOrder);
            });
        });
    });
});