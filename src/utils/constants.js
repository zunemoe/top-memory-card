export const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
};

export const DIFFICULTY_CONFIG = {
    [DIFFICULTY_LEVELS.EASY]: {
        label: 'Easy',
        pokemonCount: 20,
        maxScore: 20
    },
    [DIFFICULTY_LEVELS.MEDIUM]: {
        label: 'Medium',
        pokemonCount: 16,
        maxScore: 16
    },
    [DIFFICULTY_LEVELS.HARD]: {
        label: 'Hard',
        pokemonCount: 12,
        maxScore: 12
    }
};

export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'game-over',
    VICTORY: 'victory',
    LOADING: 'loading',
};

export const GAME_BOARD = {
    GRID_ROWS: 3,
    GRID_COLUMNS: 4,
    TOTAL_CARDS: 12
};

export const POKEMON_API = {
    BASE_URL: 'https://pokeapi.co/api/v2/pokemon',
    MIN_ID: 1,
    MAX: 1010,
    SPRITE_TYPE: 'front_default'
};

export const STORAGE_KEYS = {
    HIGH_SCORES: 'pokemon-memory-game-high-scores',
    GAME_SETTINGS: 'pokemon-memory-game-settings',
    POKEMON_CACHE: 'pokemon-memory-game-pokemon-cache'
};

export const ANIMATIONS = {
    CARD_SHUFFLE_DURATION: 600,
    SCORE_UPDATE_DURATION: 300,
    CARD_FLIP_DURATION: 200,
    VICTORY_ANIMATION_DURATION: 1000,
    LOADING_MIN_DURATION: 500
};

export const UI = {
    CARD_ASPECT_RATIO: 0.75,
    MIN_CARD_SIZE: 100,
    MAX_CARD_SIZE: 200,
    MOBILE_BREAKPOINT: 768,
    DESKTOP_BREAKPOINT: 1024
};

export const DEFAULTS = {
    SCORE: 0,
    HIGH_SCORE: 0,
    SELECTED_DIFFICULTY: DIFFICULTY_LEVELS.MEDIUM
};

export const ERROR_MESSAGES = {
    FETCH_FAILED: 'Failed to fetch Pokémon data. Please try again.',
    NETWORK_ERROR: 'Network error. Check your connection and try again.',
    GENERIC_ERROR: 'An unexpected error occurred. Please try again later.'
};

export const GAME_MESSAGES = {
    WELCOME: 'Welcome to the Pokémon Memory Card Game! Select a difficulty to start playing.',
    GAME_RULES: 'Click different Pokemon cards to earn points. Clicking the same card twice ends the game!',
    GAME_OVER: 'Game Over!',
    VICTORY: 'Congratulations! You won!',
    NEW_HIGH_SCORE: 'New High Score!',
    LOADING: 'Loading Pokémon...',
};