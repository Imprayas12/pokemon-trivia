import { useState, useEffect } from 'react';

const PokemonSearch = ({ onSelectPokemon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true);
        // Fetch only the first 100 Pokemon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPokemon([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = pokemonList.filter(pokemon => 
      pokemon.name.includes(term) || 
      getPokemonIdFromUrl(pokemon.url).toString().includes(term)
    );
    
    setFilteredPokemon(filtered.slice(0, 5)); // Limit results to 5
  }, [searchTerm, pokemonList]);

  const getPokemonIdFromUrl = (url) => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPokemon = (pokemon) => {
    const id = getPokemonIdFromUrl(pokemon.url);
    onSelectPokemon(id);
    setSearchTerm('');
    setFilteredPokemon([]);
  };

  // Function to directly search for a Pokemon by name using the API
  const searchPokemonByName = async (name) => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      const data = await response.json();
      onSelectPokemon(data.id);
      setError(null);
      return true;
    } catch (err) {
      setError(`Pokemon "${name}" not found`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    
    setError(null);
    
    // Check if search term is a number (ID)
    if (/^\d+$/.test(searchTerm)) {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${parseInt(searchTerm)}`);
        if (!response.ok) {
          throw new Error('Pokemon not found');
        }
        onSelectPokemon(parseInt(searchTerm));
        setError(null);
      } catch (err) {
        setError(`Pokemon with ID ${searchTerm} not found`);
      } finally {
        setLoading(false);
      }
    } else if (filteredPokemon.length > 0) {
      // If it's a name and we have matches, select the first match
      handleSelectPokemon(filteredPokemon[0]);
      setError(null);
    } else {
      // If no matches found in our list, try direct API search
      await searchPokemonByName(searchTerm);
    }
    
    setSearchTerm('');
    setFilteredPokemon([]);
  };

  return (
    <div className="pokemon-search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={handleSearch}
          disabled={loading}
        />
        <button type="submit" disabled={loading || searchTerm.trim() === ''}>
          Search
        </button>
      </form>
      
      {error && (
        <div className="search-error">
          {error}
        </div>
      )}
      
      {filteredPokemon.length > 0 && (
        <ul className="search-results">
          {filteredPokemon.map(pokemon => (
            <li 
              key={pokemon.name} 
              onClick={() => handleSelectPokemon(pokemon)}
            >
              #{getPokemonIdFromUrl(pokemon.url)} {pokemon.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonSearch;
