// Import necessary modules and game-related functions
import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import { nextPhase, nextTurn } from './GamePhases';
import { drawCard } from './GameLogic';

const GamePlay = () => {
    // Destructure game state values from the GameContext
    const { players, currentTurn, setCurrentTurn, phase, setPhase } = useGame();

    // useEffect hook to trigger actions at specific phases
    useEffect(() => {
        if (phase === 'Draw') {  // Automatically draw a card during the draw phase
            drawCard(players[currentTurn]);
        }
    }, [phase, currentTurn, players]);  // Re-run when phase or turn changes

    // Function to handle moving to the next phase
    const handleNextPhase = () => {
        const newPhase = nextPhase(phase);  // Get the next phase
        setPhase(newPhase);  // Update the phase

        // If the phase transitions to 'Untap', switch to the next player's turn
        if (newPhase === 'Untap') {
            setCurrentTurn(nextTurn(currentTurn, players));
        }
    };

    return (
        <div>
            <h2>Current Turn: {players[currentTurn].name}</h2>  {/* Display current player's turn */}
            <h3>Phase: {phase}</h3>  {/* Display the current phase of the game */}
            <button onClick={handleNextPhase}>End Phase</button>  {/* Button to move to the next phase */}


            <div>
                <h3>Battlefield</h3>  {/* Battlefield header */}
                <ul>
                    {players[currentTurn].battlefield.map((card, index) => (
                        <li key={index}>
                            {card.name}  {/* Display each card's name on the battlefield */}
                        
                            {/* Future interactions like attacking or using abilities can be added here */}
                        </li>
                    ))}
                </ul>
            </div>


            {/* Display current player's hand */}
            <div>
                <h3>{players[currentTurn].name}'s Hand</h3>
                <ul>
                    {players[currentTurn].hand.map((card, index) => (
                        <li key={index}>
                            {card.name} 
                            {card.imageUrl}</li> // List out each card in the player's hand
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GamePlay;
