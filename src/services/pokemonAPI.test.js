import { fetchPokemon, fetchMultiplePokemon } from './pokemonAPI';

global.fetch = jest.fn();

describe('pokemonAPI', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('fetchPokemon', () => {
        test('fetches single Pokemon data successfully', async () => {
            const mockPokemonData = {
                id: 1,
                name: 'bulbasaur',
                sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            const result = await fetchPokemon(1);
            expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');
            expect(result).toEqual(mockPokemonData);
        });

        test('handles API errors gracefully with fallback content', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            const result = await fetchPokemon(999);

            expect(result).toEqual({
                id: 999,
                name: 'Unknown Pokemon',
                sprites: '/fallback-pokemon.png',
            });
        });
    });

    describe('fetchMultiplePokemon', () => {
        test('fetches multiple Pokemon data successfully', async () => {
            const mockPokemonData = {
                id: 1,
                name: 'bulbasaur',
                sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
            };

            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockPokemonData,
            });

            const result = await fetchMultiplePokemon('easy');

            expect(fetch).toHaveBeenCalledTimes(20);
            expect(result).toHavelength(20);
            expect(result[0]).toEqual(mockPokemonData);
        });

        
    });
});

