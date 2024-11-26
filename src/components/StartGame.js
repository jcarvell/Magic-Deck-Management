// StartGame.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from './GameContext'; // Import the game context to access the game state and logic
import { useUser } from '../UserContext'; // Import useUser to get the current user
import axios from 'axios';

const API_BASE_URL = "http://localhost:7208/api"; // Replace with your actual API base URL

const StartGame = () => {
    const { startGame } = useGame(); // Access the startGame function from context
    const [decks, setDecks] = useState([]); // Store decks for the user
    const [selectedDecks, setSelectedDecks] = useState([null, null]); // Store selected decks for both players
    const navigate = useNavigate();
    const { user } = useUser(); // Get the current user from useUser hook
    const { players, setPlayers } = useGame(); // Access players from the context


    useEffect(() => {
        const fetchUserDecks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/decks/user/${user.id}`); // Fetch decks by user ID
                setDecks(response.data);  // Set the decks in state
            } catch (error) {
                console.error("Error fetching decks: ", error);
            }
        };

        if (user && user.id) {
            fetchUserDecks();  // Fetch decks for the logged-in user
        }
    }, [user]);

    const handleDeckSelect = (deckId, playerIndex) => {
        const newSelectedDecks = [...selectedDecks];
        newSelectedDecks[playerIndex] = deckId;
        setSelectedDecks(newSelectedDecks);
    };

    const handleStartGame = async () => {
        if (selectedDecks[0] && selectedDecks[1]) {
            try {

                // Fetch the actual deck data for both players
                const player1DeckResponse = await axios.get(`${API_BASE_URL}/decks/${selectedDecks[0]}`);
                const player2DeckResponse = await axios.get(`${API_BASE_URL}/decks/${selectedDecks[1]}`);
                
                
                const player1Deck = player1DeckResponse.data.cards; // Assuming API returns a 'cards' array
                const player2Deck = player2DeckResponse.data.cards;
                
                // Set players with the full deck
                setPlayers([
                    { ...players[0], deck: player1Deck },
                    { ...players[1], deck: player2Deck }
                ]);
    
                // Now you can start the game
                startGame([player1Deck, player2Deck]);
                navigate('/game'); // Navigate to the game page
            } catch (error) {
                console.error("Error fetching decks: ", error);
                alert("An error occurred while fetching the decks.");
            }
        } else {
            alert("Both players must select a deck before starting the game.");
        }
    };
    

    return (
        <div>
            <h1>Start Game</h1>
            <h2>Select Your Deck:</h2>
            {players.map((player, index) => (
                <div key={index}>
                    <h3>{`Player ${index + 1} (${user.username})`}</h3>
                    <ul>
                        {decks.map(deck => (
                            <li key={deck.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`deck-${index}`}
                                        value={deck.id}
                                        checked={selectedDecks[index] === deck.id}
                                        onChange={() => handleDeckSelect(deck.id, index)}
                                    />
                                    {deck.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

export default StartGame;
