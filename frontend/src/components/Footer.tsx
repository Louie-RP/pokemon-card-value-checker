import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} PokeValuator. Not affiliated with Nintendo or The Pokémon Company.
        <Link to="/disclaimer"> Disclaimer</Link>
        <Link to="/contact"> Contact</Link>
      </p>
    </footer>
  );
}
