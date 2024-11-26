import React, { useState } from 'react';
import axios from 'axios';

function AddCards() {
  const [cardData, setCardData] = useState(null);
  const [cardName, setCardName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Function to handle card search
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setCardData(null); // Clear previous search results

    try {
      const response = await axios.get(`https://api.scryfall.com/cards/named?exact=${cardName}`);
      setCardData(response.data);
    } catch (err) {
      setError('Error searching for card');
    }
  };

  // Function to send card data to the database on "Yes" confirmation
  const handleAddCard = async () => {
    if (!cardData) return;

    const cardToAdd = {
      name: cardData.name,
      type: cardData.type_line,
      manaCost: cardData.mana_cost,
      rarity: cardData.rarity,
      text: cardData.oracle_text,
      flavorText: cardData.flavor_text || '',
      power: cardData.power || '',
      toughness: cardData.toughness || '',
      imageUrl: cardData.image_uris?.large || ''
    };

    try {
      const response = await axios.post('http://localhost:7208/api/cards', cardToAdd);
      setMessage('Thanks for adding this card to your deck!');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('Card with this name already exists in the database.');
      } else {
        setMessage('There was an error adding the card.');
      }
    }
  };

  return (
    <div>
      <h1>Add a New Card</h1>
      <form onSubmit={handleSearch}>
        <label>
          Card Name:
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Enter card name"
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}

      {cardData && (
        <div className="card-display">
          <div className="card-image">
            <img src={cardData.image_uris?.large} alt={cardData.name} />
          </div>

          <div className="card-info">
            <h2>{cardData.name}</h2>
            <p><strong>Mana Cost:</strong> {cardData.mana_cost}</p>
            <p><strong>Type:</strong> {cardData.type_line}</p>
            <p><strong>Rarity:</strong> {cardData.rarity}</p>
            <p><strong>Oracle Text:</strong> {cardData.oracle_text}</p>
            {cardData.flavor_text && <p><strong>Flavor Text:</strong> {cardData.flavor_text}</p>}
            {cardData.power && <p><strong>Power:</strong> {cardData.power}</p>}
            {cardData.toughness && <p><strong>Toughness:</strong> {cardData.toughness}</p>}
          </div>

          <div className="confirmation">
            <h3>Is this the card you're looking for?</h3>
            <button onClick={handleAddCard}>Yes</button>
            <button onClick={() => setCardData(null)}>No</button>
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCards;
