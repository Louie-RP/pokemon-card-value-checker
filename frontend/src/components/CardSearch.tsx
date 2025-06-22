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
interface CardData extends CardChoice {
    multiple: false;
    marketPrice: MarketPrice;
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
                // Sort sets by name
                const sortedSets = res.data.sets.slice().sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name)
                );
                // Prepend All Sets
                const allSets = [{ id: 'all', name: 'All Sets' }, ...sortedSets];
                setSets(allSets);
                setSetId(allSets[0].id);
            })
            .catch(err => {
                console.error('Failed to load sets:', err);
                setError('Could not load card sets');
            });
    }, []);

    const search = async () => {
        if (!cardNumber || !setId) return;
        setLoading(true);
        setError('');
        setData(null);
        setChoices(null);

        try {
            const res = await axios.get<APIResponse>(
                'http://localhost:4000/api/card-info',
                { params: { cardNumber, setId } }
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

            <input
                type="text"
                placeholder="e.g. 4/102"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />

            <button
                onClick={search}
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
                                    search();
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
                    <p>
                        Price: ${data.marketPrice.low} – ${data.marketPrice.high}
                    </p>
                </div>
            )}
        </div>
    );
}
