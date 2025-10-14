import './HomePage.css';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { lazy, Suspense } from 'react';
const CarouselBanner = lazy(() => import('./CarouselBanner'));
//import ultraballImage from '../assets/ultraball.png';

const HomePage: React.FC = () => {
  return (
    <div className="main-content">
      <div className="container-fluid px-2 px-md-4">
        <header className="hero-section row g-0 mb-4 mx-0">
          <div className="hero-content col-12 col-lg-7 px-3 px-md-5">
            <p className="lead">Discover the true value of your Pokémon cards — instantly and effortlessly.</p>
            <Link to="/search" className="cta-button btn btn-warning fw-bold mt-2">Start Valuating Now</Link>
          </div>
          <div className="hero-image col-12 col-lg-5 d-flex justify-content-center align-items-center mt-4 mt-lg-0">
          </div>
        </header>

        <section className="features-section mb-5">
          <div className="row text-center mb-4">
            <div className="col"><h2>What You Can Do</h2></div>
          </div>
          <div className="row gy-4 justify-content-center">
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="feature-card w-100">
                <img src="/assets/value-icon.png" alt="Card value" />
                <h3>Card Value Checker</h3>
                <p>Quickly find current market prices, historical trends, and grade values for your cards.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="feature-card w-100">
                <img src="/assets/compare-icon.png" alt="eBay/TCGPlayer" />
                <h3>Price Comparisons</h3>
                <p>See listings from eBay and TCGPlayer side-by-side so you can make informed decisions.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="feature-card w-100">
                <img src="/assets/news-icon.png" alt="Trending news" />
                <h3>Latest TCG News</h3>
                <p>Stay up-to-date with new set releases, top trending cards, and market fluctuations.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="visual-section mb-5">
          <div className="row text-center mb-4">
            <div className="col"><h2>How It Works</h2></div>
          </div>
          <div className="how-it-works-steps row gy-4 justify-content-center">
            <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
              <div className="how-step w-100">
                <img src="/assets/search-icon.png" alt="Search" />
                <h4>1. Search Your Card</h4>
                <p>Type the card number to find your Pokémon card instantly.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
              <div className="how-step w-100">
                <img src="/assets/value-icon.png" alt="Value" />
                <h4>2. View Real-Time Prices</h4>
                <p>See up-to-date market prices at a glance.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
              <div className="how-step w-100">
                <img src="/assets/compare-icon.png" alt="Compare" />
                <h4>3. Compare & Decide</h4>
                <p>Compare card values and make the best decision for your collection.</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/search" className="secondary-cta btn btn-warning fw-bold mt-4">Start Valuating Now</Link>
          </div>
        </section>
        <Suspense fallback={<div className="text-center text-light py-4 small">Loading sets…</div>}>
          <CarouselBanner />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;

