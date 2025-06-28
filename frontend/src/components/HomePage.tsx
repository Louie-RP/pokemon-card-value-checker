import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="main-content">
      <header className="hero-section">
        <div className="hero-content">
          <h1>PokeValuator</h1>
          <p>Discover the true value of your Pokémon cards — instantly and effortlessly.</p>
          <Link to="/search" className="cta-button">Check Card Value</Link>
        </div>
        <div className="hero-image">
          <img src="/assets/pokeball-hero.png" alt="Pokeball background" />
        </div>
      </header>

      <section className="features-section">
        <h2>What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="/assets/value-icon.png" alt="Card value" />
            <h3>Card Value Checker</h3>
            <p>Quickly find current market prices, historical trends, and grade values for your cards.</p>
          </div>
          <div className="feature-card">
            <img src="/assets/compare-icon.png" alt="eBay/TCGPlayer" />
            <h3>Price Comparisons</h3>
            <p>See listings from eBay and TCGPlayer side-by-side so you can make informed decisions.</p>
          </div>
          <div className="feature-card">
            <img src="/assets/news-icon.png" alt="Trending news" />
            <h3>Latest TCG News</h3>
            <p>Stay up-to-date with new set releases, top trending cards, and market fluctuations.</p>
          </div>
        </div>
      </section>

      <section className="visual-section">
        <h2>Experience the Collector’s Edge</h2>
        <div className="card-mockup">
          <img src="/assets/card-mockup.png" alt="Card mockup preview" />
          <p className="caption">Sleek UI, reliable pricing, and Poké-style accuracy</p>
        </div>
        <Link to="/search" className="secondary-cta">Start Valuating Now</Link>
      </section>
    </div>
  );
};

export default HomePage;
