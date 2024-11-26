import React, { useState } from "react";
import axios from 'axios';
import './CardDetails.css'; // Import the CSS file

const SearchCardImage = () => {
  // State to store the card name input by the user
  const [cardName, setCardName] = useState('');
  // State to store the url of the card image fetched from the api
  const [cardData, setCardData] = useState(null);
  // State to store any error messages encountered during the search
  const [error, setError] = useState('');
  // State to store the message displayed currently for the buttons
  const [message, setmessage] = useState('');

  // A function to handle the search operation when the form is submitted
  const handleSearch = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    setError(null);
    setmessage('');

    try {
      // Make a GET request to the Scryfall API to search for the card by name
      const response = await axios.get(`https://api.scryfall.com/cards/named?exact=${cardName}`);
      setCardData(response.data);
    } catch (err) {
      // Set an error message if the API request fails
      setError('Error searching for card image');
    }
  };

  const handleYes = () =>{
        setmessage('Thanks for adding a new card to your deck.')
  }

  const handleNo = () =>{
    setmessage('Please try a different name then.')
  }

  return (
    <div className="card-search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)} // Update the cardName state
          placeholder="Enter card name"
        />
        <button type="submit">Search</button>
      </form>

      {/* Display any error messages */}
      {error && <p>{error}</p>}

      {/* Display the fetched card data if available */}
      {cardData && (
        <div className="card-display">
          {/* Left side - Card Image */}
          <div className="card-image">
            <img src={cardData.image_uris?.large} alt={cardData.name} />
          </div>

          {/* Right side - Card Info */}
          <div className="card-info">
            <h2>{cardData.name}</h2>
            <p><strong>Mana Cost:</strong> {cardData.mana_cost}</p>
            <p><strong>Type:</strong> {cardData.type_line}</p>
            <p><strong>Rarity:</strong> {cardData.rarity}</p>
            <p><strong>Set:</strong> {cardData.set_name}</p>
            <p><strong>Oracle Text:</strong> {cardData.oracle_text}</p>
            {cardData.flavor_text && <p><strong>Flavor Text:</strong> {cardData.flavor_text}</p>}
            {cardData.power && cardData.toughness && (
              <p><strong>Power/Toughness:</strong> {cardData.power}/{cardData.toughness}</p>
            )}
          </div>
        </div>
      )}


      {/* Create button for yes or no */}
      <h3>Is this the card you are looking for? </h3>
      <div className="button-container">
        <button type="submit" onClick={handleYes}> Yes </button>
        <button type="submit" onClick={handleNo}> No </button>
      </div>


      {/* Show the message from the yes or no button click*/}
      {message && <p>{message}</p>}


    </div>
  );
};

export default SearchCardImage;
