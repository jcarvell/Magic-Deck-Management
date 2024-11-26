
// Define the list of phases for a turn in the game. 
export const phases = ['Untap', 'Upkeep','Draw','Main 1', 'Combat', 'Main 2', 'End'];

// Function to determine the next phase in the game
export const nextPhase = (currentPhase) => {
    const currentIndex = phases.indexOf(currentPhase); // find the index of the current phase
    return phases[(currentIndex + 1)% phases.length]; // Move to the next phase (loops at the end)
};

// Function to switch to the next player's turn
export const nextTurn = (currentTurn,  players) => {
    return (currentTurn + 1) % players.length; // alternate between players
}