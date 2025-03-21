import { useState, useEffect } from 'react';

const PokemonCard = ({ pokemonId, onNavigate }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
          throw new Error('Pokemon not found');
        }
        const data = await response.json();
        setPokemon(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!pokemon) return null;

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <h2>#{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span 
              key={type.type.name} 
              className={`type-badge ${type.type.name}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
      
      <div className="pokemon-image">
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
          alt={pokemon.name} 
        />
      </div>
      
      <div className="pokemon-stats">
        <h3>Base Stats</h3>
        {pokemon.stats.map(stat => (
          <div key={stat.stat.name} className="stat-row">
            <div className="stat-name">{formatStatName(stat.stat.name)}</div>
            <div className="stat-value">{stat.base_stat}</div>
            <div className="stat-bar">
              <div 
                className="stat-fill" 
                style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="navigation-buttons">
        <button 
          onClick={() => onNavigate(pokemon.id - 1)}
          disabled={pokemon.id <= 1}
        >
          Previous
        </button>
        <button onClick={() => onNavigate(pokemon.id + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

function formatStatName(statName) {
  switch (statName) {
    case 'hp': return 'HP';
    case 'attack': return 'Attack';
    case 'defense': return 'Defense';
    case 'special-attack': return 'Sp. Atk';
    case 'special-defense': return 'Sp. Def';
    case 'speed': return 'Speed';
    default: return statName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}

export default PokemonCard;
