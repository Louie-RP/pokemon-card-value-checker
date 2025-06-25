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

interface CardData extends CardChoice {
    multiple: false;
    marketPrice: MarketPrice | null;
    tcgplayerPrice?: TCGPlayerPrice | null;
}

// API response types (discriminated union)
interface APIResponseMultiple {
    multiple: true;
    cards: CardChoice[];
}

type APIResponseSingle = CardData;
type APIResponse = APIResponseMultiple | APIResponseSingle;

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
                    {(data.marketPrice && data.marketPrice.low && data.marketPrice.high) ? (
                        <p>
                            eBay Market Price: ${data.marketPrice.low} – ${data.marketPrice.high}
                        </p>
                    ) : (
                        <p style={{ color: 'orange' }}>No eBay price data found for this card.</p>
                    )}

                    {/* TCGPlayer Price Section */}
                    {data.tcgplayerPrice && (
                        <div style={{ marginTop: 16 }}>
                            <h4>TCG Player (Holofoil):</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Low: {data.tcgplayerPrice.low !== null ? `$${data.tcgplayerPrice.low}` : 'N/A'}</li>
                                <li>Mid: {data.tcgplayerPrice.mid !== null ? `$${data.tcgplayerPrice.mid}` : 'N/A'}</li>
                                <li>High: {data.tcgplayerPrice.high !== null ? `$${data.tcgplayerPrice.high}` : 'N/A'}</li>
                                <li>Market: {data.tcgplayerPrice.market !== null ? `$${data.tcgplayerPrice.market}` : 'N/A'}</li>
                                <li>Direct Low: {data.tcgplayerPrice.directLow !== null ? `$${data.tcgplayerPrice.directLow}` : 'N/A'}</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
