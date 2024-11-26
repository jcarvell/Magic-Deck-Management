import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:7208/api";

const EditDecks = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { deckName, deckId } = location.state || {};  // Destructure deckName and deckId from location.state
    const { user } = useUser();

    // States
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(deckId || null);  // Use deckId if available
    const [cardName, setCardName] = useState('');
    const [cardData, setCardData] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [deckCards, setDeckCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

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


    // Fetch the cards for the deck that is selected 
    useEffect(() => {
        const fetchDeckCards = async () => {
            if(selectedDeck){
                try{
                    // Fetch cards for the selected deck
                    const response = await axios.get(`${API_BASE_URL}/decks/${selectedDeck}/cards`);
                    setDeckCards(response.data);
                }catch(error){
                    setError("Error fetching Cards for Deck.");
                    console.error("Error fetching cards for deck: ", error);
                }
            }
    };
    fetchDeckCards();
}, [selectedDeck]);


    // Handle selecting a deck
    const handleSelectDeck = (deckId) => {
        setSelectedDeck(deckId);
    };

    // Handle card search using Scryfall API
    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setCardData(null); // Clear previo s search results
        setMessage('');

        try {
            const response = await axios.get(`https://api.scryfall.com/cards/named?exact=${cardName}`);
            setCardData(response.data);
        } catch (err) {
            setError('Error searching for card');
        }
    };

    // Handle adding a card to the selected deck
    const handleAddCard = async () => {
        if (!selectedDeck) {
            setMessage('No deck selected.');
            return;
        }
    
        const cardToAdd = {
            name: cardData.name,
            type: cardData.type_line,
            manaCost: cardData.mana_cost || '',
            rarity: cardData.rarity,
            text: cardData.oracle_text,
            flavorText: cardData.flavor_text || '',
            power: cardData.power || 0,
            toughness: cardData.toughness || 0,
            imageUrl: cardData.image_uris?.large || ''
        };
    
        try {
            const response = await axios.post(`${API_BASE_URL}/decks/${selectedDeck}/cards`, cardToAdd);
            setMessage('Card added successfully to the deck!');
        } catch (error) {
            console.error("Error adding card to the deck: ", error);
            setMessage(`Error adding card to the deck. ${error.response.data}`);
        }
    };
    
    
    // Handle view decks navigation
    const handleViewDecks = () => navigate('/view-decks');

    // Handle selecting a deck from the form and navigating back to the page
    const handleSubmit = () => {
        if (selectedDeck) {
            navigate("/edit-decks", {
                state: {
                    deckName: decks.find(deck => deck.id === selectedDeck).name,
                    deckId: selectedDeck,
                }
            });
        }
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    }

    const handleDeleteCard = async () => {
        if(!selectedCard){
            setMessage('No card selected for deletion.');
            return;
        }
        try {
            const response = await axios.delete(`${API_BASE_URL}/decks/${selectedDeck}/cards/${selectedCard.id}`);
            setMessage('Card was deleted Succesfully');
            setDeckCards(deckCards.filter(card => card.id !== selectedCard.id)); //Update the state to remove the deleted card.
            setSelectedCard(null); // reset the card after deletion
        }catch (error){
            setError('Error deleting the card');
            console.error('Error deleting card.', error);
        }

    };

    return (
        <div>
            <h1>Edit Decks</h1>
            {deckName && selectedDeck ? (
                <div>
                    <h2>You are currently editing "{deckName}" deck id: {selectedDeck}</h2>

                    {/* Display the cards in the selected deck */}
                    <h3>Cards in this deck:</h3>
                    {deckCards.length > 0 ? (
                        <ul style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0 }}> 
                        {/*Using Hardcoded values in here to list the images in a horrizontal order instead of using App.css. 
                        Some error with i believe how UL is handling container. Revist later to try and troubleshoot*/}
                        {deckCards.map((card) => (
                            <li key={card.id} style={{ margin: '10px' }} onClick={() => handleCardClick(card)}>
                            <div
                                style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: selectedCard?.id === card.id ? '2px solid red' : '1px solid #ccc',
                                padding: '10px',
                                width: '300px',
                                cursor: 'pointer'
                                }}
                            >
                                <h3>{card.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={card.imageUrl}
                                    alt={card.name}
                                    style={{
                                    maxWidth: '300px',
                                    height: 'auto',
                                    borderRadius: '5px',
                                    }}
                                />
                                </div>
                            </div>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p>No cards in this deck yet.</p>
                    )}

                    {selectedCard && (
                        <div>
                        <h3> selectedCard: {selectedCard.name} </h3>
                        <button onClick={handleDeleteCard}> Delete Card</button>
                        </div>
                    )}


                    {/* Search and Add Card */}
                    <div>
                        <h3>Add a Card to Deck</h3>
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

                        {error && <p style={{ color: 'red' }}>{error}</p>}

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

                    <button type="button" onClick={handleViewDecks}> View Decks</button>
                </div>
            ) : (
                <div>
                    <h2>No deck selected</h2>
                    <h1>Edit Decks for {user && user.username}</h1>
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
                </div>
            )}
        </div>
    );
};

export default EditDecks;
