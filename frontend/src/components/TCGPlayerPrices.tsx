import React from 'react';

interface TCGPlayerPrice {
    low: number | null;
    mid: number | null;
    high: number | null;
    market: number | null;
    directLow: number | null;
}

interface TCGPlayerPricesProps {
    prices: TCGPlayerPrice;
    formatPrice: (price: number | null | undefined) => string;
}

const TCGPlayerPrices: React.FC<TCGPlayerPricesProps> = ({ prices, formatPrice }) => (
    <div style={{ marginTop: 16 }}>
        <h4>TCG Player (Holofoil):</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Low: {formatPrice(prices.low)}</li>
            <li>Mid: {formatPrice(prices.mid)}</li>
            <li>High: {formatPrice(prices.high)}</li>
            <li>Market: {formatPrice(prices.market)}</li>
            <li>Direct Low: {formatPrice(prices.directLow)}</li>
        </ul>
    </div>
);

export default TCGPlayerPrices;