import './HomePage.css';
import pokeballImg from '../assets/pokeball.png';
import { Link } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
const CarouselBanner = lazy(() => import('./CarouselBanner'));

const features = [
  {
    Icon: lazy(() => import('./icons').then(m => ({ default: m.ValueIcon }))),
    title: 'Card Value Checker',
    text: 'Instant pricing, historical trends, and grade insights for any card.'
  },
  {
    Icon: lazy(() => import('./icons').then(m => ({ default: m.CompareIcon }))),
    title: 'Price Comparisons',
    text: 'Side-by-side marketplace data to guide smarter decisions.'
  },
  {
    Icon: lazy(() => import('./icons').then(m => ({ default: m.NewsIcon }))),
    title: 'Latest TCG News',
    text: 'Stay informed about releases, market shifts, and top movers.'
  }
];

const steps = [
  {
    num: 1,
    Icon: lazy(() => import('./icons').then(m => ({ default: m.SearchIcon }))),
    title: 'Search Your Card',
    text: 'Enter set + number (e.g. 4/102) to fetch precise data.'
  },
  {
    num: 2,
    Icon: lazy(() => import('./icons').then(m => ({ default: m.ValueIcon }))),
    title: 'View Real-Time Prices',
    text: 'We aggregate multiple sources for a clear snapshot.'
  },
  {
    num: 3,
    Icon: lazy(() => import('./icons').then(m => ({ default: m.CompareIcon }))),
    title: 'Compare & Decide',
    text: 'Evaluate markets and pick the best move for your collection.'
  }
];

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600); // simulate brief load for skeleton showcase
    return () => clearTimeout(t);
  }, []);
  const track = (action: string, label: string) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', action, { label });
    }
  };
  return (
    <div className="main-content home-page">
      <div className="container-xl px-3 px-md-4">
        {/* Hero */}
        <section className="home-hero py-5 py-lg-6">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-lg-7 order-2 order-lg-1 hero-copy">
              <h1 className="hero-title mb-3">Know Your Card’s True Value</h1>
              <p className="hero-tagline mb-4">Accurate multi-source pricing & trend insights for Pokémon card collectors.</p>
              <div className="d-flex flex-wrap gap-3 mb-4 hero-actions">
                <Link to="/search" className="btn btn-accent btn-lg fw-semibold" onClick={() => track('cta_click','start_valuating_top')}>Start Valuating</Link>
                <Link to="/disclaimer" className="btn btn-hero-outline btn-lg fw-semibold" onClick={() => track('cta_click','learn_more_top')}>Learn More</Link>
              </div>
              <ul className="hero-metrics list-unstyled d-flex flex-wrap gap-4 mb-0">
                <li><span className="metric-value">50K+</span><span className="metric-label">Cards Indexed</span></li>
                <li><span className="metric-value">Realtime</span><span className="metric-label">Price Feeds</span></li>
                <li><span className="metric-value">Multi-Source</span><span className="metric-label">Comparisons</span></li>
              </ul>
            </div>
            <div className="col-12 col-lg-5 order-1 order-lg-2 d-flex justify-content-center">
              <div className="hero-visual">
                <img src={pokeballImg} loading="lazy" width={220} height={220} className="hero-pokeball" alt="Poké Ball representing Pokémon card value visualization" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="home-features py-5">
          <div className="section-heading text-center mb-5">
            <h2 className="section-title">What You Can Do</h2>
            <p className="section-sub">Tools built for clarity and confident collecting.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {features.map(f => (
              <div key={f.title} className="col-12 col-sm-6 col-lg-4 d-flex">
                <div className="pv-card feature-card flex-fill">
                  <div className="icon-wrap mb-3">
                    {loading ? (
                      <div className="skeleton-circle" aria-hidden="true" />
                    ) : (
                      <Suspense fallback={<div className="skeleton-circle" aria-hidden="true" />}> 
                        {f.Icon && <f.Icon />}
                      </Suspense>
                    )}
                  </div>
                  <h3 className="feature-title mb-2">{f.title}</h3>
                  <p className="feature-text mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works timeline */}
        <section className="home-how-it-works py-5">
          <div className="section-heading text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">From query to actionable pricing in three clear steps.</p>
          </div>
          <ol className="timeline list-unstyled mb-5">
            {steps.map(s => (
              <li key={s.num} className="timeline-item" onClick={() => track('timeline_step','step_'+s.num)}>
                <div className="timeline-node" aria-hidden="true">{s.num}</div>
                <div className="timeline-content pv-card">
                  <div className="timeline-icon">
                    {loading ? (
                      <div className="skeleton-circle" aria-hidden="true" />
                    ) : (
                      <Suspense fallback={<div className="skeleton-circle" aria-hidden="true" />}>{s.Icon && <s.Icon />}</Suspense>
                    )}
                  </div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-text mb-0">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="text-center">
            <Link to="/search" className="btn btn-accent btn-lg fw-semibold" onClick={() => track('cta_click','start_valuating_mid')}>Start Valuating Now</Link>
          </div>
        </section>

        {/* Carousel remains */}
        <Suspense fallback={<div className="text-center text-light py-4 small">Loading sets…</div>}>
          <CarouselBanner />
        </Suspense>

        {/* CTA Band */}
        <section className="home-cta-band py-5 text-center">
          <h2 className="cta-band-title mb-3">Ready to Discover Hidden Value?</h2>
          <p className="cta-band-text mb-4">Search now and uncover pricing insights across multiple sources.</p>
          <Link to="/search" className="btn btn-accent btn-lg fw-semibold" onClick={() => track('cta_click','search_card_bottom')}>Search a Card</Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

