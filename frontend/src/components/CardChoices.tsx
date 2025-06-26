import React from 'react';

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
        <ul className="card-choices-list">
            {choices.map(c => (
                <li key={c.id} onClick={() => onChoiceClick(c)}>
                    <img
                        src={c.image}
                        alt={c.name}
                        width={50}
                        style={{ verticalAlign: 'middle', marginRight: 8 }}
                    />
                    <span>
                        {c.name} ({c.set})
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default CardChoices;