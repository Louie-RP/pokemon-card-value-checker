import React from 'react';
import { formatPrice } from './cardPriceUtils';

interface EbayPSAPricesProps {
    prices: {
        [grade: string]: {
            average: number | null;
            count: number | null;
        };
    };
}

const EbayPSAPrices: React.FC<EbayPSAPricesProps> = ({ prices }) => (
    <div className="price-panel-inner">
        <h4>eBay PSA Prices:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(prices).map(([grade, value]) => (
                <li key={grade}>
                    PSA {grade}: {formatPrice(value.average)} ({value.count ?? 0} sold)
                </li>
            ))}
        </ul>
    </div>
);

export default EbayPSAPrices;