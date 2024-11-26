import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext"; // Import useUser from UserContext

const API_BASE_URL = "http://localhost:7208/api";

const ViewDecks = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [message, setMessage] = useState('');
    const [decks, setDecks] = useState([]); // Store decks for the user
    const [error, setError] = useState(null); // Handle errors
    const [selectedDeck, setSelectedDeck] = useState(null);

    const { user } = useUser();  // Get the current user from useUser hook
    const navigate = useNavigate();

    // Fetch user's decks when the component mounts
    useEffect(() => {
        const fetchUserDecks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/decks/user/${user.id}`); // Fetch decks by user ID
                setDecks(response.data);  // Set the decks in state
            } catch (error) {
                setError("Error fetching decks");
                console.error("Error fetching decks: ", error);
            }
        };

        if (user && user.id) {
            fetchUserDecks();  // Fetch decks for the logged-in user
        }
    }, [user]);

    const handleStartNewDeck = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDeckName('');
    };

    const handleEditDecks = () => navigate('/edit-decks');

    const handleSelectDeck = (deckid) => {
        setSelectedDeck(deckid);
    }

    const handleSubmit = () => {
        if (selectedDeck) {
            const selectedDeckObject =  decks.find(deck => deck.id === parseInt(selectedDeck));
            // Navigate to some page where this selected deck will be used
            navigate(`/edit-decks`, {state: {deckName: selectedDeckObject.name, deckid: selectedDeckObject.id}});
        } else {
            alert("Please select a deck");
        }
    };

    const handleCreateDeck = async () => {
        if (!user || !user.id) {
            setMessage('User not logged in. Unable to create deck.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/decks`, {
                name: deckName,
                userId: user.id   // Include userId (ID from context)
            });
            console.log(response.data);
            setMessage('Deck created successfully!');
            handleCloseModal();
            setDecks(prevDecks => [...prevDecks, response.data]);  // Add the new deck to the list
        } catch (error) {
            console.error('Error creating deck: ', error);
            setMessage('There was an error creating the deck.');
        }
    };

    return (
        <div>
            <h1>View Decks for {user && user.username}</h1>
            {error && <p>{error}</p>}  {/* Display error if there is one */}
            <ul>
                {decks.length > 0 ? (
                    <form> 
                        {decks.map((deck) => (
                        <div key={deck.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="deck"
                                    value={deck.id}
                                    checked={selectedDeck === deck.id}
                                    onChange={() => handleSelectDeck(deck.id)}
                                />
                                {deck.name}
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={handleSubmit}>
                        Select Deck
                    </button>
                    </form>
                ) : (
                    <p>No decks found.</p>
                )}
            </ul>
            
            <button onClick={handleEditDecks}>Edit Deck</button>
            <button onClick={handleStartNewDeck}>Start New Deck</button>
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create New Deck</h2>
                        <input
                            type="text"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            placeholder="Enter deck name"
                        />
                        <button onClick={handleCreateDeck}> Create Deck</button>
                        <button onClick={handleCloseModal}> Cancel </button>
                    </div>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default ViewDecks;
