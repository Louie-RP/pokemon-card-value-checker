import React from 'react';
import { formatPrice } from './cardPriceUtils';

interface CardMarketPrice {
    averageSellPrice?: number;
    lowPrice?: number;
    trendPrice?: number;
}

interface CardMarketPricesProps {
    prices: CardMarketPrice;
    eurToUsd: (eur: number | null | undefined) => number | null;
}

const CardMarketPrices: React.FC<CardMarketPricesProps> = ({ prices, eurToUsd }) => (
    <div className="price-panel-inner">
        <h4>Cardmarket (converted to USD):</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Average Sell Price: {formatPrice(eurToUsd(prices.averageSellPrice))}</li>
            <li>Low Price: {formatPrice(eurToUsd(prices.lowPrice))}</li>
            <li>Trend Price: {formatPrice(eurToUsd(prices.trendPrice))}</li>
        </ul>
    </div>
);

export default CardMarketPrices;