// src/components/DeckListPage.js
import React, { useEffect, useState } from 'react';
import { fetchDecks } from '../Services/api';

const DeckListPage = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await fetchDecks();
        setDecks(data);
      } catch (error) {
        setError('Failed to fetch decks');
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Deck List</h2>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>{deck.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DeckListPage;
