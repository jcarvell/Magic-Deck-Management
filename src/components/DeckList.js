import React from 'react';

const DeckList = ({ decks, onEdit }) => {
  return (
    <div>
      <h3>Existing Decks</h3>
      <ul>
        {decks.map((deck, index) => (
          <li key={index}>
            {deck.name}
            <button onClick={() => onEdit(deck)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckList;
