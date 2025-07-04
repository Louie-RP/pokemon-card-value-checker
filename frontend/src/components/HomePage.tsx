import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import './HomePage.css';
import CarouselBanner from './CarouselBanner';
//import ultraballImage from '../assets/ultraball.png';

const HomePage: React.FC = () => {
  return (
    <div className="main-content">
      <header className="hero-section">
        <div className="hero-content">
          <p>Discover the true value of your Pokémon cards — instantly and effortlessly.</p>
          <Link to="/search" className="cta-button">Start Valuating Now</Link>
        </div>
        <div className="hero-image">
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
        <h2>How It Works</h2>
        <div className="how-it-works-steps">
          <div className="how-step">
            <img src="/assets/search-icon.png" alt="Search" />
            <h4>1. Search Your Card</h4>
            <p>Type the card number to find your Pokémon card instantly.</p>
          </div>
          <div className="how-step">
            <img src="/assets/value-icon.png" alt="Value" />
            <h4>2. View Real-Time Prices</h4>
            <p>See up-to-date market prices at a glance.</p>
          </div>
          <div className="how-step">
            <img src="/assets/compare-icon.png" alt="Compare" />
            <h4>3. Compare & Decide</h4>
            <p>Compare card values and make the best decision for your collection.</p>
          </div>
        </div>
        <Link to="/search" className="secondary-cta">Start Valuating Now</Link>
      </section>
      <CarouselBanner />
    </div>

  );
};

export default HomePage;

