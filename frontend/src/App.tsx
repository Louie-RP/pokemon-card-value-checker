import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // <-- Add this import
import HomePage from './components/HomePage';
import CardSearchPage from './components/CardSearchPage';
import Contact from './components/Contact';
import Disclaimer from './components/Disclaimer';
import './App.css';

function App() {
  return (
    <Router>
      <Header /> {/* Add this line */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<CardSearchPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </Router>
  );
}

export default App;
