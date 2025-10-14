import React from 'react';
import './CardDetails.css';
import TCGPlayerPrices from './TCGPlayerPrices';
import CardMarketPrices from './CardMarketPrices';
import PriceTrackerTCGPlayerPrices from './PriceTrackerTCGPlayerPrices';
import EbayPSAPrices from './EbayPSAPrices';

// Import the interfaces for the price types
interface TCGPlayerPrice {
    low: number | null;
    mid: number | null;
    high: number | null;
    market: number | null;
    directLow: number | null;
}

interface CardMarketPrice {
    averageSellPrice?: number;
    lowPrice?: number;
    trendPrice?: number;
}

interface PriceTrackerTCGP {
    lowPrice?: number;
    midPrice?: number;
    highPrice?: number;
    marketPrice?: number;
    directLowPrice?: number;
}

interface EbayPSAPricesType {
    [grade: string]: {
        average: number | null;
        count: number | null;
    };
}

interface CardData {
    id: string;
    name: string;
    setId: string;
    set: string;
    image: string;
    multiple: false;
    marketPrice: { low: string; high: string } | null;
    tcgplayerPrice?: TCGPlayerPrice | null;
    cardmarket?: CardMarketPrice | null;
    priceTrackerTCGPlayer?: PriceTrackerTCGP | null;
    ebayPSAPrices?: EbayPSAPricesType | null;
}

interface CardDetailsProps {
    data: CardData;
    formatPrice: (price: number | null | undefined) => string;
    eurToUsd: (eur: number | null | undefined) => number | null;
}

const CardDetails: React.FC<CardDetailsProps> = ({ data, formatPrice, eurToUsd }) => {
    const priceSections = [
        data.tcgplayerPrice && (
            <TCGPlayerPrices key="tcgplayer" prices={data.tcgplayerPrice} formatPrice={formatPrice} />
        ),
        data.cardmarket && (
            <CardMarketPrices key="cardmarket" prices={data.cardmarket} eurToUsd={eurToUsd} />
        ),
        data.priceTrackerTCGPlayer && (
            <PriceTrackerTCGPlayerPrices key="ptcgplayer" prices={data.priceTrackerTCGPlayer} formatPrice={formatPrice} />
        ),
        data.ebayPSAPrices && (
            <EbayPSAPrices key="ebaypsa" prices={data.ebayPSAPrices} />
        ),
    ].filter(Boolean);

    const isSingle = priceSections.length === 1;
    const priceClass = isSingle ? 'card-details-prices one-col' : 'card-details-prices two-col';

    return (
        <div className={`card-details-flex-container ${isSingle ? 'single-price-layout' : ''}`}>        
            {isSingle && (
                <div className="card-details-unified-heading" role="heading" aria-level={2}>
                    <h2 className="mb-0">{data.name}</h2>
                </div>
            )}
            <div className="card-details-image-col fade-in-up">
                {!isSingle && <h2>{data.name}</h2>}
                <img src={data.image} alt={data.name} className="card-details-image" />
            </div>
            {!isSingle && <div className="card-details-separator d-none d-lg-block" aria-hidden="true" />}
            <div className={`card-details-prices-col ${isSingle ? 'single-price-col' : ''}`}>            
                <div className={priceClass}>
                    {priceSections.map((section, idx) => {
                        const delay = 80 * idx; // stagger
                        const commonProps: React.HTMLAttributes<HTMLDivElement> = { className: 'price-panel fade-in-up', style: { animationDelay: `${delay}ms` } };
                        if (priceSections.length === 3 && idx === 2) {
                            return (
                                <div key={idx} className="full-width" {...commonProps}>
                                    {section}
                                </div>
                            );
                        }
                        return (
                            <div key={idx} {...commonProps}>
                                {section}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CardDetails;