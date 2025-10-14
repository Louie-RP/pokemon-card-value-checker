
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
        <label htmlFor="card-number" className="form-label fw-semibold">Card Number:</label>
        <input
            id="card-number"
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            className="card-number-input form-control text-center"
            disabled={loading}
            placeholder="e.g. 4/102"
            autoComplete="off"
        />
        <div className="card-search-buttons mt-2">
            <button type="submit" disabled={loading || !cardNumber} className="btn btn-primary w-50">
                {loading ? 'Searching...' : 'Search'}
            </button>
            <button
                type="button"
                onClick={onClear}
                disabled={loading}
                className="btn btn-outline-light w-50"
            >
                Clear
            </button>
        </div>
    </form>
);

export default CardSearchForm;