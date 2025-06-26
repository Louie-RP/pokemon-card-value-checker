import React from 'react';

interface CardSearchFormProps {
    cardNumber: string;
    setCardNumber: (num: string) => void;
    loading: boolean;
    onSearch: () => void;
    onClear: () => void;
}

const CardSearchForm: React.FC<CardSearchFormProps> = ({
    cardNumber,
    setCardNumber,
    loading,
    onSearch,
    onClear,
}) => (
    <form
        onSubmit={e => {
            e.preventDefault();
            onSearch();
        }}
        style={{ marginBottom: 16 }}
    >
        <div style={{ width: 220, margin: '0 auto' }}>
            <label htmlFor="card-number">Card Number:</label>
            <input
                id="card-number"
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: 8, margin: '8px 0' }}
                disabled={loading}
                placeholder="e.g. 4/102"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <button type="submit" disabled={loading || !cardNumber}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                    type="button"
                    onClick={onClear}
                    disabled={loading}
                    style={{ background: '#eee', color: '#333', border: '1px solid #ccc' }}
                >
                    Clear
                </button>
            </div>
        </div>
    </form>
);

export default CardSearchForm;