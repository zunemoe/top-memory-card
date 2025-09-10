import { POKEMON_API } from "../utils/constants";

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const cache = new Map();

export const fetchPokemon = async (id) => {
    const cacheKey = `pokemon_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) return cachedData.data;

    try {
        const response = await fetch(`${POKEMON_API.BASE_URL}/${id}`);

        if (!response.ok) throw new Error(`Failed to fetch Pokemon ${id}: ${response.statusText}`);

        const pokemon = await response.json();
        const pokemonData = {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default || pokemon.sprites.front_shiny || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types: pokemon.types.map(t => t.type.name),
        };

        cache.set(cacheKey, {
            data: pokemonData,
            timestamp: Date.now()
        });

        return pokemonData;
    } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error);

        return {
            id,
            name: `Pokemon ${id}`,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types: ['unknown'],
            isError: true
        };
    }
};

export const fetchMultiplePokemon = async (ids) => {
    if (!ids || ids.length === 0) return [];

    try {
        const promises = ids.map(id => fetchPokemon(id));
        const results = await Promise.allSettled(promises);

        return results.map((result, index) => {
            if (result.status === 'fulfilled') return result.value;
            else {
                console.error(`Failed to fetch Pokemon with ID ${ids[index]}:`, result.reason);
                return {
                    id: ids[index],
                    name: `Pokemon ${ids[index]}`,
                    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ids[index]}.png`,
                    types: ['unknown'],
                    isError: true
                };
            }
        });
    } catch (error) {
        console.error('Error fetching multiple Pokemons:', error);
        throw error;
    }
};

export const clearCache = () => {
    cache.clear();
};