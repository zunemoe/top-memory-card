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
            <div className="card-content">
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
                <div className='pokemon-types'>
                    {pokemon.types.map(type => (
                        <span key={type} className={`type-badge type-${type}`}>
                            {type}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Card;