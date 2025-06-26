import React from 'react';
import CardSearch from './components/CardSearch';
import './App.css';

function App() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        <h1 className="pokemon-title">
          <span className="poke-p">P</span>okéValuator
        </h1>
        <div className="slogan">Gotta appraise &apos;em all!</div>
      </div>
      <CardSearch />
    </div>
  );
}

export default App;
