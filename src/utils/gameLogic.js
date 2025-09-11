export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

export const generateRandomPokemonIds = (count, min = 1, max = 1010) => {
    const ids = new Set();
    while (ids.size < count) {
        const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
        ids.add(randomId);
    }
    return Array.from(ids);
};

export const selectCardsForBoard = (pokemonPool, cardCount = 12) => {
    if (pokemonPool.length < cardCount) return pokemonPool;
    return shuffleArray(pokemonPool).slice(0, cardCount);
};