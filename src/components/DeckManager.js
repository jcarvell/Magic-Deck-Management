import React, { useState } from "react";

function DeckManager({ user }) {
  const [deckList, setDeckList] = useState("");

  const handleDeckUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setDeckList(e.target.result);
    };
  };

  const handleDeckSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the deckList to your backend.
    console.log("Deck Submitted:", deckList);
  };

  return (
    <div>
      <h2>Welcome, {user}</h2>
      <form onSubmit={handleDeckSubmit}>
        <div>
          <label>Upload Decklist: </label>
          <input type="file" accept=".txt" onChange={handleDeckUpload} />
        </div>
        <div>
          <label>Or Paste Your Decklist: </label>
          <textarea
            value={deckList}
            onChange={(e) => setDeckList(e.target.value)}
            rows="10"
            cols="50"
          ></textarea>
        </div>
        <button type="submit">Submit Deck</button>
      </form>
    </div>
  );
}

export default DeckManager;
