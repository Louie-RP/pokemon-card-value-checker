import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Card Search' },
    { to: '/contact', label: 'Contact' },
    { to: '/disclaimer', label: 'Disclaimer' },
];

export default function Header() {
    const location = useLocation();

    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="pokemon-title">
                    <span className="poke-p">P</span>okéValuator
                </div>
                <nav>
                    <ul className="nav-list">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={location.pathname === link.to ? 'active' : ''}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}