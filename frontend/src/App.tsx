import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CardSearchPage from './components/CardSearchPage';
import Contact from './components/Contact';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import './App.css';
import './pokeFont.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-flex-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<CardSearchPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
