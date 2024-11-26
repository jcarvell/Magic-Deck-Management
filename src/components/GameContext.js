// GameContext.js
import React, { createContext, useState, useContext } from "react";
import {phases, nextPhase, nextTurn} from './GamePhases';

// Create a context to hold the game state globally
const GameContext = createContext();

// Custom hook to use the GameContext
export const useGame = () => useContext(GameContext);

// GameProvider component to manage and provide game state to all child components
export const GameProvider = ({ children }) => {
    const [players, setPlayers] = useState([
        { name: 'Player 1', life: 40, deck: [], hand: [], graveyard: [], battlefield: [] },
        { name: 'Player 2', life: 40, deck: [], hand: [], graveyard: [], battlefield: [] }
    ]);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [phase, setPhase] = useState(phases[0]);

    const advanceToNextPhase = () =>{
        const newPhase = nextPhase(phase);
        setPhase(newPhase);


        // If newphase is untap then switch players.
        if (newPhase === 'Untap') {
            setCurrentTurn(nextTurn(currentTurn, players)); // Switch to the next player
        }
    }

    const shuffleDeck = (deck) => {
        const shuffledDeck = [...deck]; // create a copy of the deck
        for(let i = shuffledDeck.length -1; i >0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[i] , shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
        }
        return shuffledDeck;

    }

    const startGame = (selectedDecks) => {
        const updatedPlayers = players.map((player, index) => {
            const shuffledDeck = shuffleDeck(selectedDecks[index]); //shuffle the deck
            return{
                ...player,
                deck: shuffledDeck,
                hand: [], // Reset hand at the start of the game
            }

        });

        // Update players with their selected decks
        setPlayers(updatedPlayers);
        drawInitialHands(updatedPlayers); // Call to draw initial hands
    };

    const drawInitialHands = () => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) => {
                const deckArray = Array.isArray(player.deck) ? player.deck : [];
                const hand = deckArray.slice(0, 7); // Draw the top 7 cards
                const updateddeck = deckArray.slice(7);
                return {
                    ...player,
                    hand: hand, 
                    deck: updateddeck,
                    
                };
            })
        );
    };
    
    const value = {
        players,
        setPlayers,
        currentTurn,
        setCurrentTurn,
        phase,
        setPhase,
        advanceToNextPhase,  // Include this function here
        startGame, // Provide startGame method to context
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
