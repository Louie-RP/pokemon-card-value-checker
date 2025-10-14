import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
// Minimal Bootstrap Collapse type (avoids adding full @types)
interface BootstrapCollapse {
    getOrCreateInstance(element: Element): { hide: () => void };
}

declare global {
    interface Window {
        bootstrap?: { Collapse?: BootstrapCollapse };
        gtag?: (...args: unknown[]) => void;
    }
}
import './Header.css';
import ThemeToggle from './ThemeToggle';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Card Search' },
    { to: '/contact', label: 'Contact' },
    { to: '/disclaimer', label: 'Disclaimer' },
];

export default function Header() {
    const location = useLocation();
    const headerRef = useRef<HTMLElement | null>(null);
    const collapseRef = useRef<HTMLDivElement | null>(null);
        const togglerRef = useRef<HTMLButtonElement | null>(null);

    // Scroll shrink / shadow enhancement
    useEffect(() => {
        const onScroll = () => {
            const scrolled = window.scrollY > 8;
            headerRef.current?.classList.toggle('scrolled', scrolled);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Auto close collapse on route change or link click (mobile)
    useEffect(() => {
        const navEl = collapseRef.current;
        if (!navEl) return;
        if (navEl.classList.contains('show')) {
            // Use Bootstrap collapse API if available
                    const maybeCollapse = window.bootstrap?.Collapse;
                    if (maybeCollapse && typeof maybeCollapse.getOrCreateInstance === 'function') {
                        const instance = maybeCollapse.getOrCreateInstance(navEl);
                instance.hide();
            } else {
                navEl.classList.remove('show');
            }
        }
    }, [location.pathname]);

    // ESC key closes menu if open
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && collapseRef.current?.classList.contains('show')) {
                        const maybeCollapse = window.bootstrap?.Collapse;
                        if (maybeCollapse && typeof maybeCollapse.getOrCreateInstance === 'function' && collapseRef.current) {
                            const instance = maybeCollapse.getOrCreateInstance(collapseRef.current);
                    instance.hide();
                } else {
                    collapseRef.current.classList.remove('show');
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

        // Outside click closes open mobile menu
        useEffect(() => {
            const onClick = (e: MouseEvent) => {
                if (!collapseRef.current?.classList.contains('show')) return;
                const target = e.target as Node;
                if (collapseRef.current && !collapseRef.current.contains(target) && !togglerRef.current?.contains(target)) {
                    const maybeCollapse = window.bootstrap?.Collapse;
                    if (maybeCollapse && collapseRef.current) {
                        const instance = maybeCollapse.getOrCreateInstance(collapseRef.current);
                        instance.hide();
                    } else {
                        collapseRef.current.classList.remove('show');
                    }
                }
            };
            document.addEventListener('click', onClick);
            return () => document.removeEventListener('click', onClick);
        }, []);

        // Simple focus trap when menu open
        useEffect(() => {
            const trap = (e: KeyboardEvent) => {
                if (e.key !== 'Tab' || !collapseRef.current?.classList.contains('show')) return;
                const focusables = collapseRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            };
            window.addEventListener('keydown', trap);
            return () => window.removeEventListener('keydown', trap);
        }, []);

    // Simple analytics events using gtag if available
    const trackNav = (label: string) => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'nav_click', { label });
        }
    };

    return (
        <header ref={headerRef} className="site-header shadow-sm transition-header">
            <nav className="navbar navbar-expand-lg navbar-dark py-2">
                <div className="container-fluid px-3 px-md-4">
                    <Link
                        to="/"
                        className="navbar-brand d-flex align-items-center gap-1 pokemon-title mb-0"
                        onClick={() => trackNav('brand')}
                    >
                        <span className="poke-p">P</span>okéValuator
                    </Link>
                                <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNav"
                        aria-controls="mainNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                                    ref={togglerRef}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div
                        className="collapse navbar-collapse justify-content-center"
                        id="mainNav"
                        ref={collapseRef}
                    >
                        <ul className="navbar-nav gap-lg-2 mt-3 mt-lg-0">
                            {navLinks.map(link => {
                                const active = location.pathname === link.to;
                                return (
                                    <li className="nav-item" key={link.to}>
                                        <Link
                                            to={link.to}
                                            onClick={() => trackNav(link.label)}
                                            className={`nav-link fw-semibold px-3 py-2 rounded-3 ${active ? 'active' : ''}`}
                                            aria-current={active ? 'page' : undefined}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                                                </ul>
                                                <div className="ms-lg-3 mt-3 mt-lg-0">
                                                    <ThemeToggle />
                                                </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}