// React 17+ with jsx transform: no need for explicit React import
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CardSearchPage from './components/CardSearchPage';
import Contact from './components/Contact';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import './App.css';
import './pokeFont.css';

function AppShell() {
  const location = useLocation();
  // Persist last visited route
  useEffect(() => {
    localStorage.setItem('lastRoute', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <div id="main-content" className="app-flex-wrapper" role="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<CardSearchPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
