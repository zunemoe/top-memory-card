import { fetchPokemon, fetchMultiplePokemon, clearCache } from './pokemonAPI';

global.fetch = jest.fn();

describe('pokemonAPI', () => {
    beforeEach(() => {
        fetch.mockClear();
        clearCache();
    });

    describe('fetchPokemon', () => {
        test('fetches single Pokemon data successfully and transforms it', async () => {
            const mockPokemonData = {
                id: 1,
                name: 'bulbasaur',
                sprites: { 
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png'
                },
                types: [
                    { type: { name: 'grass' } },
                    { type: { name: 'poison' } }
                ]
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            const result = await fetchPokemon(1);
            expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');
            expect(result).toEqual({
                id: 1,
                name: 'bulbasaur',
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                types: ['grass', 'poison']
            });
        });

        test('uses shiny sprite when front_default is not available', async () => {
            const mockPokemonData = {
                id: 25,
                name: 'pikachu',
                sprites: { 
                    front_default: null,
                    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png'
                },
                types: [
                    { type: { name: 'electric' } }
                ]
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            const result = await fetchPokemon(25);
            expect(result.sprite).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png');
        });

        test('handles API errors gracefully with fallback content', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await fetchPokemon(999);

            expect(result).toEqual({
                id: 999,
                name: 'Pokemon 999',
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/999.png',
                types: ['unknown'],
                isError: true
            });
        });

        test('caches Pokemon data to avoid repeated API calls', async () => {
            const mockPokemonData = {
                id: 150,
                name: 'mewtwo',
                sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png' },
                types: [
                    { type: { name: 'psychic' } }
                ]
            };

            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockPokemonData,
            });

            await fetchPokemon(150);
            await fetchPokemon(150);

            expect(fetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('fetchMultiplePokemon', () => {
        test('fetches multiple Pokemon data successfully', async () => {
            const mockPokemon1 = {
                id: 1, name: 'bulbasaur', sprites: { front_default: 'bulbasaur.png' },
                types: [{ type: { name: 'grass' } }]
            };
            const mockPokemon2 = {
                id: 2, name: 'ivysaur', sprites: { front_default: 'ivysaur.png' },
                types: [{ type: { name: 'grass' } }]
            };

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPokemon1,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockPokemon2,
                });

            const result = await fetchMultiplePokemon([1, 2]);

            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenNthCalledWith(1, 'https://pokeapi.co/api/v2/pokemon/1');
            expect(fetch).toHaveBeenNthCalledWith(2, 'https://pokeapi.co/api/v2/pokemon/2');
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: 1, name: 'bulbasaur', sprite: 'bulbasaur.png', types: ['grass']
            });
            expect(result[1]).toEqual({
                id: 2, name: 'ivysaur', sprite: 'ivysaur.png', types: ['grass']
            });
        });

        test('handles empty array input', async () => {
            const result = await fetchMultiplePokemon([]);
            expect(result).toEqual([]);
            expect(fetch).not.toHaveBeenCalled();
        });
        
        test('processes large number of Pokemon requests efficiently', async () => {
            const pokemonIds = Array.from({ length: 20 }, (_, i) => i + 1);

            pokemonIds.forEach(id => {
                fetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({
                        id,
                        name: `pokemon${id}`,
                        sprites: { front_default: `pokemon${id}.png` },
                        types: [{ type: { name: 'normal' } }]
                    }),
                });
            });

            const result = await fetchMultiplePokemon(pokemonIds);

            expect(fetch).toHaveBeenCalledTimes(20);
            expect(result).toHaveLength(20);
            expect(result.every(pokemon => !pokemon.isError)).toBe(true);
        });
    });

    describe('clearCache', () => {
        test('clears the cached Pokemon data', async () => {
            const mockPokemonData = {
                id: 10,
                name: 'caterpie',
                sprites: { front_default: 'caterpie.png' },
                types: [{ type: { name: 'bug' } }]
            };

            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockPokemonData,
            });

            await fetchPokemon(10);
            expect(fetch).toHaveBeenCalledTimes(1);

            await fetchPokemon(10);
            expect(fetch).toHaveBeenCalledTimes(1); // Cached

            clearCache();

            await fetchPokemon(10);
            expect(fetch).toHaveBeenCalledTimes(2); // Fetch again after cache clear
        });
    });
});

