import React, { useState, useEffect } from 'react';
import axios from 'axios';

type MarketPrice = { low: string; high: string };

// Brief card info when multiple matches
interface CardChoice {
    id: string;
    name: string;
    setId: string;
    set: string;
    image: string;
}

// Full card data when single match
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
    // ...add more if you want
}
interface PriceTrackerTCGP {
    lowPrice?: number;
    midPrice?: number;
    highPrice?: number;
    marketPrice?: number;
    directLowPrice?: number;
    // ...add more if you want
}

interface CardData extends CardChoice {
    multiple: false;
    marketPrice: MarketPrice | null;
    tcgplayerPrice?: TCGPlayerPrice | null;
    cardmarket?: CardMarketPrice | null;
    priceTrackerTCGPlayer?: PriceTrackerTCGP | null;
    ebayPSAPrices?: EbayPSAPrices; // <-- add this
}

// API response types (discriminated union)
interface APIResponseMultiple {
    multiple: true;
    cards: CardChoice[];
}

type APIResponseSingle = CardData;
type APIResponse = APIResponseMultiple | APIResponseSingle;

type EbayPSAPrices = {
    [grade: string]: {
        average: number | null;
        count: number | null;
    };
};

const EUR_TO_USD = 1.08; // Update this rate as needed

function eurToUsd(eur: number | null | undefined): number | null {
    if (typeof eur !== 'number' || isNaN(eur)) return null;
    return +(eur * EUR_TO_USD).toFixed(2);
}

export default function CardSearch() {
    const [cardNumber, setCardNumber] = useState('');
    const [setId, setSetId] = useState('all');
    const [sets, setSets] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<CardData | null>(null);
    const [choices, setChoices] = useState<CardChoice[] | null>(null);

    // Fetch sets and prepend "All Sets"; sort remaining alphabetically
    useEffect(() => {
        axios.get('http://localhost:4000/api/sets')
            .then(res => {
                const sortedSets = res.data.sets.slice().sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name)
                );
                const allSets = [{ id: 'all', name: 'All Sets' }, ...sortedSets];
                setSets(allSets);
                setSetId(allSets[0].id);
            })
            .catch(err => {
                console.error('Failed to load sets:', err);
                setError('Could not load card sets');
                setData(null);
                setChoices(null);
            });
    }, []);

    // Combined search function accepting optional overrideSetId
    const search = async (overrideSetId?: string) => {
        const effectiveSetId = overrideSetId || setId;
        if (!cardNumber || !effectiveSetId) return;
        setLoading(true);
        setError('');
        setData(null);
        setChoices(null);

        try {
            const res = await axios.get<APIResponse>(
                'http://localhost:4000/api/card-info',
                { params: { cardNumber, setId: effectiveSetId } }
            );

            if ('multiple' in res.data && res.data.multiple) {
                setChoices((res.data as APIResponseMultiple).cards);
            } else {
                setData(res.data as APIResponseSingle);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.error || err.message;
                setError(`Error: ${msg}`);
            } else if (err instanceof Error) {
                setError(`Error: ${err.message}`);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    function formatPrice(value: number | null | undefined): string {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <label htmlFor="set-select">Set:</label>
            {sets.length > 0 ? (
                <select
                    id="set-select"
                    value={setId}
                    onChange={e => setSetId(e.target.value)}
                    style={{ display: 'block', width: '100%', padding: 8, margin: '8px 0' }}
                >
                    {sets.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            ) : (
                <p>Loading sets...</p>
            )}

            <input
                type="text"
                placeholder="e.g. 4/102"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />

            <button
                onClick={() => search()}
                disabled={loading || !sets.length}
                style={{ padding: '8px 16px', width: '100%' }}
            >
                {loading ? 'Searching…' : 'Search'}
            </button>

            {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

            {/* Multiple matches: user must select one */}
            {choices && choices.length > 0 && (
                <div style={{ marginTop: 24 }}>
                    <h3>Select the correct card:</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {choices.map(c => (
                            <li
                                key={c.id}
                                onClick={() => {
                                    setSetId(c.setId);
                                    setChoices(null);
                                    search(c.setId);  // Use overrideSetId
                                }}
                                style={{ cursor: 'pointer', margin: '8px 0' }}
                            >
                                <img
                                    src={c.image}
                                    alt={c.name}
                                    width={50}
                                    style={{ verticalAlign: 'middle', marginRight: 8 }}
                                />
                                <span>{c.name} ({c.set})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Single match result */}
            {data && !choices && (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <h2>{data.name}</h2>
                    <img
                        src={data.image}
                        alt={data.name}
                        style={{ maxWidth: '100%' }}
                    />


                    {/* TCGPlayer Price Section */}
                    {data.tcgplayerPrice && (
                        <div style={{ marginTop: 16 }}>
                            <h4>TCG Player (Holofoil):</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Low: {formatPrice(data.tcgplayerPrice.low)}</li>
                                <li>Mid: {formatPrice(data.tcgplayerPrice.mid)}</li>
                                <li>High: {formatPrice(data.tcgplayerPrice.high)}</li>
                                <li>Market: {formatPrice(data.tcgplayerPrice.market)}</li>
                                <li>Direct Low: {formatPrice(data.tcgplayerPrice.directLow)}</li>
                            </ul>
                        </div>
                    )}

                    {/* CardMarket Price Section */}
                    {data.cardmarket && (
                        <div style={{ marginTop: 16 }}>
                            <h4>CardMarket (converted to USD):</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Average Sell Price: {formatPrice(eurToUsd(data.cardmarket.averageSellPrice))}</li>
                                <li>Low Price: {formatPrice(eurToUsd(data.cardmarket.lowPrice))}</li>
                                <li>Trend Price: {formatPrice(eurToUsd(data.cardmarket.trendPrice))}</li>
                            </ul>
                        </div>
                    )}

                    {/* PokePriceTracker TCGP Price Section */}
                    {data.priceTrackerTCGPlayer && (
                        <div style={{ marginTop: 16 }}>
                            <h4>PokePriceTracker TCG Player:</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Low Price: {formatPrice(data.priceTrackerTCGPlayer.lowPrice)}</li>
                                <li>Mid Price: {formatPrice(data.priceTrackerTCGPlayer.midPrice)}</li>
                                <li>High Price: {formatPrice(data.priceTrackerTCGPlayer.highPrice)}</li>
                                <li>Market Price: {formatPrice(data.priceTrackerTCGPlayer.marketPrice)}</li>
                                <li>Direct Low Price: {formatPrice(data.priceTrackerTCGPlayer.directLowPrice)}</li>
                            </ul>
                        </div>
                    )}

                    {/* eBay PSA Graded Prices Section */}
                    {data.ebayPSAPrices && (
                        <div style={{ marginTop: 16 }}>
                            <h4>eBay PSA Graded Prices:</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {["8", "9", "10"].map(grade => {
                                    const priceObj = data.ebayPSAPrices![grade];
                                    return (
                                        <li key={grade}>
                                            PSA {grade}: {formatPrice(priceObj?.average)}
                                            {priceObj && priceObj.count !== null ? ` (${priceObj.count} sold)` : ''}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
