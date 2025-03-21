import { useState } from 'react'
import PokemonCard from './components/PokemonCard'
import PokemonSearch from './components/PokemonSearch'
import './App.css'

function App() {
  const [currentPokemonId, setCurrentPokemonId] = useState(1);

  const handleSelectPokemon = (id) => {
    // Ensure ID is within valid range (1-1010 for current Pokemon)
    if (id < 1) id = 1;
    setCurrentPokemonId(id);
  };

  return (
    <div className="pokemon-app">
      <header>
        <h1>Poke-Trivia</h1>
        <PokemonSearch onSelectPokemon={handleSelectPokemon} />
      </header>
      
      <main>
        <PokemonCard 
          pokemonId={currentPokemonId} 
          onNavigate={handleSelectPokemon} 
        />
      </main>
    </div>
  )
}

export default App
