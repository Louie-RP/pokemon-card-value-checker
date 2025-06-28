import React from 'react';
import './Disclaimer.css';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="main-content">
      <h1>Disclaimer</h1>
      <p>
        PokeValuator is an unofficial Pokémon card value checker created by fans for informational and entertainment purposes only.
        This website is not affiliated with, endorsed by, sponsored by, or in any way officially connected with Nintendo, Game Freak,
        The Pokémon Company, or any of their subsidiaries or affiliates.
      </p>
      <p>
        All Pokémon names, logos, brands, characters, and card images are registered trademarks of their respective owners.
        All content on this site is provided in accordance with fair use guidelines.
      </p>
      <p>
        We do not sell any cards directly. All pricing data is pulled from third-party sources such as eBay and TCGPlayer,
        and any purchases made through affiliate links are subject to those sites’ terms and conditions.
      </p>
      <p>
        If you are a rights holder and believe your content has been used inappropriately, please contact us.
        You can reach us through our <Link to="/contact">Contact page</Link>.
      </p>
    </div>
  );
}
