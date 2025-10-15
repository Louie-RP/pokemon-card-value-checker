import React from 'react';

interface PriceTrackerTCGP {
    lowPrice?: number;
    midPrice?: number;
    highPrice?: number;
    marketPrice?: number;
    directLowPrice?: number;
}

interface PriceTrackerTCGPlayerPricesProps {
    prices: PriceTrackerTCGP;
    formatPrice: (price: number | null | undefined) => string;
}

const PriceTrackerTCGPlayerPrices: React.FC<PriceTrackerTCGPlayerPricesProps> = ({ prices, formatPrice }) => (
    <div className="price-panel-inner">
        <h4>Price Tracker TCGPlayer:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Low: {formatPrice(prices.lowPrice)}</li>
            <li>Mid: {formatPrice(prices.midPrice)}</li>
            <li>High: {formatPrice(prices.highPrice)}</li>
            <li>Market: {formatPrice(prices.marketPrice)}</li>
            <li>Direct Low: {formatPrice(prices.directLowPrice)}</li>
        </ul>
    </div>
);

export default PriceTrackerTCGPlayerPrices;