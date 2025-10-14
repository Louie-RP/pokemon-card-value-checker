import './Disclaimer.css';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="main-content">
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xxl-8">
            <div className="disclaimer-container">
              <h1 className="mb-4">Disclaimer</h1>
              <p>
                <strong>PokeValuator</strong> is an unofficial Pokémon card value checker created by fans for informational and entertainment purposes only.
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
              <ul className="list-group disclaimer-points mb-4">
                <li className="list-group-item bg-transparent border-secondary text-light">
                  <strong>Accuracy of Information:</strong> While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, reliability, or accuracy of the card values or other data presented on this site. Use this information at your own risk.
                </li>
                <li className="list-group-item bg-transparent border-secondary text-light">
                  <strong>No Financial Advice:</strong> The information provided on this website does not constitute investment, financial, or collecting advice. Please do your own research before making any purchasing or selling decisions.
                </li>
                <li className="list-group-item bg-transparent border-secondary text-light">
                  <strong>External Links:</strong> This website may contain links to external sites. We are not responsible for the content or privacy practices of those sites.
                </li>
                <li className="list-group-item bg-transparent border-secondary text-light">
                  <strong>Limitation of Liability:</strong> By using this site, you agree that PokeValuator and its creators are not liable for any losses or damages arising from the use of this website or reliance on any information provided herein.
                </li>
              </ul>
              <p className="mb-0">
                If you are a rights holder and believe your content has been used inappropriately, please contact us.
                You can reach us through our <Link to="/contact" className="fw-semibold link-warning">Contact page</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
