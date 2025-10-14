import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-auto">
      <div className="container py-3 py-md-4 text-center small text-light">
        <div className="mb-2 fw-medium">
          © {year} PokeValuator • Not affiliated with Nintendo or The Pokémon Company
        </div>
        <div className="footer-links d-flex flex-wrap justify-content-center gap-3">
          <Link to="/disclaimer" className="link-light link-opacity-75-hover">Disclaimer</Link>
          <Link to="/contact" className="link-light link-opacity-75-hover">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
