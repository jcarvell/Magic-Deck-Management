// Function for drawing a card from the players deck and adding it to their hand
export const drawCard = (player) => {
    if(player.deck.length > 0 ){ //Check if there are cards in the deck
        const cardDrawn = player.deck[0]; //Get the top card from the deck
        player.hand.push(cardDrawn); // Add the drawn card to the players hand
        player.deck.shift(); //remove the drawn card from the deck
    }
};

// Function to start the game by drawing 7 cards for each player
export const startGame = (player) => {
    player.forEach(player => {
        for ( let i = 0; i<= 7; i++){ // Draw 7 cards for each player
            drawCard(player);
        }
    });
};

// Function to play a card from the player's hand to the battlefield
export const playCard = (player, cardIndex) => {
    const card = player.hand[cardIndex];  // Get the selected card from hand
    player.battlefield.push(card);  // Add the card to the battlefield
    player.hand.splice(cardIndex, 1);  // Remove the card from the hand
};

// Function to check if a player's life total has reached 0 or below
export const checkEndGame = (players) => {
    players.forEach(player => {
        if (player.life <= 0) {  // Check if the player's life total is 0 or below
            alert(`${player.name} loses the game!`);  // Alert the loss condition
            // Logic for ending the game or restarting can be implemented here
        }
    });
};

// Shuffle the player's deck
export const shuffleDeck = (player) => {
    for (let i = player.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
    }
};