// Function to handle attacking with a creature
export const attackWithCreature = (attacker, creatureIndex) => {
    const attackingCreature = attacker.battlefield[creatureIndex];  // Get the attacking creature
    return attackingCreature; // return creature object
}

// Function to declare a blocker 
export const declareBlocker = (defender, creatureIndex) => {
    const blockingCreature = defender.battlefield[creatureIndex]; // Get the blocking creature
    return blockingCreature;
}

// Function to resolve combat between two creatures or deal direct damage
export const handleCombat = (attacker, defender, attackingCreature, blockingCreature) => {
    // Logic for combat resolution between creatures or direct player damage goes here
};