import React, { useState } from 'react';
import axios from 'axios';

type MarketPrice = { low: string; high: string };

export default function CardSearch() {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<{ name: string; image: string; marketPrice: MarketPrice } | null>(null);

    const search = async () => {
        if (!cardNumber) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            const res = await axios.get('http://localhost:4000/api/card-info', {
                params: { cardNumber }
            });
            setData(res.data);
        } catch (error: unknown) {
            // Narrow the error
            if (axios.isAxiosError(error)) {
                // AxiosError: might have a response with a .data.error
                setError(error.response?.data?.error || 'Fetch error');
            } else {
                // Unknown (non-Axios) error
                setError('Fetch error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <input
                type="text"
                placeholder="e.g. 4/102"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            <button onClick={search} disabled={loading} style={{ padding: '8px 16px' }}>
                {loading ? 'Searching…' : 'Search'}
            </button>

            {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
            {data && (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <h2>{data.name}</h2>
                    <img src={data.image} alt={data.name} style={{ maxWidth: '100%' }} />
                    <p>Price: ${data.marketPrice.low} – ${data.marketPrice.high}</p>
                </div>
            )}
        </div>
    );
}
