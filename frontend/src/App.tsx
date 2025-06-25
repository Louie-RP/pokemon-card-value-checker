import React from 'react';
import CardSearch from './components/CardSearch';

function App() {
  return (
    <div>
      <h1 className="pokemon-title" style={{ textAlign: 'center', marginTop: 24 }}>
        <span className="poke-p">P</span>okémon Card Checker
      </h1>
      <CardSearch />
    </div>
  );
}

export default App;
