import CardSearch from './CardSearch';
import './CardSearchPage.css';

const CardSearchPage: React.FC = () => (
    <div className="main-content">
        <div className="container py-3 py-md-4">
            <div className="row justify-content-center text-center">
                <div className="col-12 col-md-10 col-lg-8 cardsearch-header">
                    <h1 className="pokemon-title mb-2">
                        <span className="poke-p"></span>PokéValuator
                    </h1>
                    <div className="slogan">Gotta appraise &apos;em all!</div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
                <div className="col-12 col-md-8 col-lg-6">
                    <CardSearch />
                </div>
            </div>
        </div>
    </div>
);

export default CardSearchPage;