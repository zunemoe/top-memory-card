import './Card.css';

const Card = ({ pokemon, onClick }) => {
    const handleClick = () => {
        onClick(pokemon);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(pokemon);
        }
    };

    return (
        <div 
        className="pokemon-card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Click ${pokemon.name} pokemon card`}
        data-testid="pokemon-card"
        >
            <img
                src={pokemon.sprite}
                alt={`${pokemon.name} sprite`}
                className="pokemon-sprite"
                data-testid="pokemon-sprite"
                loading="lazy"
            />
            <h3
                className="pokemon-name"
                data-testid="pokemon-name"
            >
                {pokemon.name}
            </h3>
        </div>
    );
};

export default Card;