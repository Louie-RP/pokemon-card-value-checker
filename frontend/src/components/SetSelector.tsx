
interface SetSelectorProps {
    sets: { id: string; name: string }[];
    setId: string;
    setSetId: (id: string) => void;
}

const SetSelector: React.FC<SetSelectorProps> = ({ sets, setId, setSetId }) => (
    <div className="set-selector-wrapper mb-3 text-center">
        <label htmlFor="set-select" className="form-label fw-semibold">Set:</label>
        {sets.length > 0 ? (
            <select
                id="set-select"
                value={setId}
                onChange={e => setSetId(e.target.value)}
                className="set-selector-select form-select"
            >
                {sets.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
        ) : (
            <p className="text-light small">Loading sets...</p>
        )}
    </div>
);

export default SetSelector;