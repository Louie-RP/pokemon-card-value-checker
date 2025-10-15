
interface CardChoice {
    id: string;
    name: string;
    setId: string;
    set: string;
    image: string;
}

interface CardChoicesProps {
    choices: CardChoice[];
    onChoiceClick: (choice: CardChoice) => void;
}

const CardChoices: React.FC<CardChoicesProps> = ({ choices, onChoiceClick }) => (
    <div style={{ marginTop: 24 }}>
        <ul className="card-choices-list list-group">
            {choices.map(c => (
                <li
                    key={c.id}
                    onClick={() => onChoiceClick(c)}
                    className="list-group-item d-flex align-items-center bg-transparent text-light border-secondary"
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={c.image}
                        alt={c.name}
                        width={50}
                        style={{ marginRight: 12, maxWidth: '100%', height: 'auto' }}
                    />
                    <span className="fw-medium">
                        {c.name} ({c.set})
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default CardChoices;