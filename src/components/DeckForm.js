import React, { useState } from 'react';

const DeckForm = ({ deck, onSave, onCancel }) => {
  const [newCard, setNewCard] = useState('');

  const handleAddCard = () => {
    onSave({
      ...deck,
      cards: [...deck.cards, newCard]
    });
    setNewCard('');
  };

  return (
    <div>
      <h2>{deck.name}</h2>
      <input
        type="text"
        value={newCard}
        onChange={(e) => setNewCard(e.target.value)}
        placeholder="Enter card name"
      />
      <button onClick={handleAddCard}>Add Card</button>
      <button onClick={() => onSave(deck)}>Save Deck</button>
      <button onClick={onCancel}>Cancel</button>
      <ul>
        {deck.cards.map((card, index) => (
          <li key={index}>{card}</li>
        ))}
      </ul>
    </div>
  );
};

export default DeckForm;
