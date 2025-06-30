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
        className="card-search-form"
    >
        <label htmlFor="card-number">Card Number:</label>
        <input
            id="card-number"
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            className="card-number-input"
            disabled={loading}
            placeholder="e.g. 4/102"
        />
        <div className="card-search-buttons">
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
    </form>
);

export default CardSearchForm;