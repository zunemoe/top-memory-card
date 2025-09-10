import { render, screen, fireEvent } from '@testing-library/react';
import IntroScreen from './IntroScreen';
import { DIFFICULTY_LEVELS, GAME_MESSAGES } from '../../utils/constants';

describe('IntroScreen', () => {
    const mockOnStartGame = jest.fn();
    const mockOnDifficultyChange = jest.fn();
    
    const defaultProps = {
        selectedDifficulty: null,
        highScores: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        onStartGame: mockOnStartGame,
        onDifficultyChange: mockOnDifficultyChange
    };

    beforeEach(() => {
        mockOnStartGame.mockClear();
        mockOnDifficultyChange.mockClear();
    });

    describe('Component Rendering', () => {
        test('renders game title prominently', () => {
            render(<IntroScreen {...defaultProps} />);

            const title = screen.getByRole('heading', { level: 1 });
            expect(title).toBeInTheDocument();
            expect(title).toHaveTextContent('Pokemon Memory Card Game');
        });

        test('shows three difficulty buttons', () => {
            render(<IntroScreen {...defaultProps} />);

            expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /hard/i })).toBeInTheDocument();
        });

        test('displays Start Game button', () => {
            render(<IntroScreen {...defaultProps} />);

            const startButton = screen.getByRole('button', { name: /start game/i });
            expect(startButton).toBeInTheDocument();
        });

        test('displays game rules and instructions', () => {
            render(<IntroScreen {...defaultProps} />);

            expect(screen.getByText(GAME_MESSAGES.WELCOME)).toBeInTheDocument();
            expect(screen.getByText(GAME_MESSAGES.GAME_RULES)).toBeInTheDocument();
        });
    });

    describe('High Score Display', () => {
        test('shows high scores for each difficulty levels', () => {
            const propsWithHighScores = {
                ...defaultProps,
                highScores: {
                    easy: 18,
                    medium: 15,
                    hard: 10
                }
            };
            render(<IntroScreen {...propsWithHighScores} />);

            expect(screen.getByText(/easy: 18/i)).toBeInTheDocument();
            expect(screen.getByText(/medium: 15/i)).toBeInTheDocument();
            expect(screen.getByText(/hard: 10/i)).toBeInTheDocument();
        });

        test('handles cases when no high score exit', () => {
            render(<IntroScreen {...defaultProps} />);

            expect(screen.getByText(/easy: 0/i)).toBeInTheDocument();
            expect(screen.getByText(/medium: 0/i)).toBeInTheDocument();
            expect(screen.getByText(/hard: 0/i)).toBeInTheDocument();
        });
    });

    describe('Difficulty Selection', () => {
        test('can select Easy difficulty', () => {
            render(<IntroScreen {...defaultProps} />);

            const easyButton = screen.getByRole('button', { name: /easy/i });
            fireEvent.click(easyButton);

            expect(mockOnDifficultyChange).toHaveBeenCalledWith(DIFFICULTY_LEVELS.EASY);
        });

        test('can select Medium difficulty', () => {
            render(<IntroScreen {...defaultProps} />);

            const mediumButton = screen.getByRole('button', { name: /medium/i });
            fireEvent.click(mediumButton);

            expect(mockOnDifficultyChange).toHaveBeenCalledWith(DIFFICULTY_LEVELS.MEDIUM);
        });

        test('can select Hard difficulty', () => {
            render(<IntroScreen {...defaultProps} />);

            const hardButton = screen.getByRole('button', { name: /hard/i });
            fireEvent.click(hardButton);

            expect(mockOnDifficultyChange).toHaveBeenCalledWith(DIFFICULTY_LEVELS.HARD);
        });

        test('highlights selected difficulty button', () => {
            const propsWithSelection = {
                ...defaultProps,
                selectedDifficulty: DIFFICULTY_LEVELS.MEDIUM
            };

            render(<IntroScreen {...propsWithSelection} />);

            const mediumButton = screen.getByRole('button', { name: /medium/i });
            expect(mediumButton).toHaveClass('active');

            const easyButton = screen.getByRole('button', { name: /easy/i });
            expect(easyButton).not.toHaveClass('active');
            const hardButton = screen.getByRole('button', { name: /hard/i });
            expect(hardButton).not.toHaveClass('active');
        });
    });

    describe('Start Game Button Behavior', () => {
        test('Start button is disabled when no difficulty is selected', () => {
            render(<IntroScreen {...defaultProps} />);

            const startButton = screen.getByRole('button', { name: /start game/i });
            expect(startButton).toBeDisabled();
        });

        test('Start button is enabled when a difficulty is selected', () => {
            const propsWithSelection = {
                ...defaultProps,
                selectedDifficulty: DIFFICULTY_LEVELS.EASY
            };

            render(<IntroScreen {...propsWithSelection} />);

            const startButton = screen.getByRole('button', { name: /start game/i });
            expect(startButton).toBeEnabled();
        });

        test('clicking Start Game button triggers callback with selected difficulty', () => {
            const propsWithSelection = {
                ...defaultProps,
                selectedDifficulty: DIFFICULTY_LEVELS.HARD
            };

            render(<IntroScreen {...propsWithSelection} />);

            const startButton = screen.getByRole('button', { name: /start game/i });
            fireEvent.click(startButton);

            expect(mockOnStartGame).toHaveBeenCalledWith(DIFFICULTY_LEVELS.HARD);
        });
    });
});