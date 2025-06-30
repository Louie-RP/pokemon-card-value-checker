import React from 'react';
import CardSearch from './CardSearch';
import './CardSearchPage.css';

const CardSearchPage: React.FC = () => (
    <div className="main-content">
        <div className="cardsearch-header">
            <h1 className="pokemon-title">
                <span className="poke-p">P</span>okéValuator
            </h1>
            <div className="slogan">Gotta appraise &apos;em all!</div>
        </div>
        <CardSearch />
    </div>
);

export default CardSearchPage;