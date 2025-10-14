import { useState, useEffect } from 'react';
import axios from 'axios';
import '../pokeFont.css';
import SetSelector from './SetSelector';
import CardSearchForm from './CardSearchForm';
import CardChoices from './CardChoices';
import CardDetails from './CardDetails';
import './CardSearch.css'; // Make sure this is imported

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

import { eurToUsd, formatPrice } from './cardPriceUtils';

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
        axios.get('http://localhost:4000/api/sets?all=true')
            .then(res => {
                // If backend returns an array, use res.data directly
                const setsArray = Array.isArray(res.data) ? res.data : res.data.sets;
                const sortedSets = setsArray.slice().sort((a: { name: string }, b: { name: string }) =>
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

    const handleChoiceClick = (choice: CardChoice) => {
        setSetId(choice.setId);
        setChoices(null);
        setCardNumber('');
        search(choice.setId);
    };

    const handleClear = () => {
        setCardNumber('');
        setSetId('all');
        setData(null);
        setChoices(null);
        setError('');
    };

    return (
        <div className="w-100">
            <div className="card-search-center mx-auto">
                <SetSelector sets={sets} setId={setId} setSetId={setSetId} />
                <CardSearchForm
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    loading={loading}
                    onSearch={() => search()}
                    onClear={handleClear}
                />
            </div>
            {error && <p className="text-danger fw-semibold mt-3 text-center" style={{ marginTop: 12 }}>{error}</p>}
            {choices && choices.length > 0 && (
                <div className="mt-3">
                    <CardChoices choices={choices} onChoiceClick={handleChoiceClick} />
                </div>
            )}
            {data && !choices && (
                <div className="mt-4">
                    <CardDetails data={data} formatPrice={formatPrice} eurToUsd={eurToUsd} />
                </div>
            )}
        </div>
    );
}
