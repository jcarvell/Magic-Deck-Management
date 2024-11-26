import React, {useState} from 'react';
import { useGame } from './GameContext';

const Battlefield = ({ cards, rotate, onCardClick, isCurrentPlayer }) => {
    const [counters, setCounters] = useState(cards.map(() => 0));

    const incrementCounter = (index, event) => {
        event.stopPropagation();
        if (!isCurrentPlayer) return; // Prevent incrementing if not the current player
        setCounters(prevCounters => {
            const newCounters = [...prevCounters];
            newCounters[index] += 1;
            return newCounters;
        });
    };

    const decrementCounter = (index, event) => {
        event.stopPropagation();
        if (!isCurrentPlayer) return; // Prevent decrementing if not the current player
        setCounters(prevCounters => {
            const newCounters = [...prevCounters];
            newCounters[index] = Math.max(0, newCounters[index] - 1); // Prevent negative counters
            return newCounters;
        });
    };

    // Separate land cards from non-land cards
    const landCards = cards.filter(card => card.type.toLowerCase().includes('land'));
    const nonLandCards = cards.filter(card => !card.type.toLowerCase().includes('land'));

    return (
        <div style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
            {/* Non-land cards zone */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                transform: rotate ? 'rotate(180deg)' : 'none',
            }}>
                {nonLandCards.length > 0 ? (
                    nonLandCards.map((card, index) => (
                        <div
                            key={index}
                            style={{ margin: card.tapped ? '0px 30px' : '0 10px', textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => onCardClick(card)}
                        >
                            <img
                                src={card.imageUrl}
                                alt={card.name}
                                style={{
                                    width: '150px',
                                    height: '200px',
                                    transform: card.tapped ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.3s ease',
                                }}
                            />
                            <div>{card.name}</div>
                            <div style={{ margin: '5px 0' }}>Counters: {counters[index]} </div>
                            <button onClick={(event) => incrementCounter(index, event)}>+</button>
                            <button onClick={(event) => decrementCounter(index, event)}>-</button>
                        </div>
                    ))
                ) : (
                    <div>No cards on the battlefield.</div>
                )}
            </div>

            {/* Land cards zone */}
            <div style={{
                marginTop: '20px',
                borderTop: '1px solid #ccc',
                paddingTop: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                transform: rotate ? 'rotate(180deg)' : 'none',
            }}>
                {landCards.length > 0 ? (
                    landCards.map((card, index) => (
                        <div
                            key={index}
                            style={{ margin: card.tapped ? '0px 30px' : '0 10px', textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => onCardClick(card)}
                        >
                            <img
                                src={card.imageUrl}
                                alt={card.name}
                                style={{
                                    width: '150px',
                                    height: '200px',
                                    transform: card.tapped ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.3s ease',
                                }}
                            />
                            <div>{card.name}</div>
                            <div style={{ margin: '5px 0' }}>Counters: {counters[index]} </div>
                            <button onClick={(event) => incrementCounter(index, event)}>+</button>
                            <button onClick={(event) => decrementCounter(index, event)}>-</button>
                        </div>
                    ))
                ) : (
                    <div>No lands on the battlefield.</div>
                )}
            </div>
        </div>
    );
};



// LifeTotal Component
const LifeTotal = ({ player, adjustLife }) => (
    <div style={{ margin: '0px', textAlign: 'center' }}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
            <h3 style={{marginRight: '20px'}}>{player.name}</h3>
            <button onClick={() => adjustLife(player, -1)}>-</button>
            <h2 style={{margin: '0 15px'}}>{player.life}</h2>
            <button onClick={() => adjustLife(player, 1)}>+</button>
        </div>
        
    </div>
);

// Deck Component 
 const Deck = ({imageUrl, onDrawCard }) => (
    <div style={{textAlign: 'center', marginBottom: '10px', cursor: 'pointer'}} onClick={onDrawCard}>
        <img
            src={imageUrl}
            alt='Deck'
            style={{width: '150px', height: '200px'}}
        />
        <div>Deck</div>
    </div>
   
 );

// Graveyard Component
const Graveyard = ({ graveyard }) => (
    <div style={{textAlign: 'center', marginBottom: '10px'}}>
        <h3>Graveyard</h3>
        <div>
            {graveyard.length> 0 ? (
                //Show the top card in the graveyard
                <img
                    src = {graveyard[graveyard.length -1].imageUrl}
                    alt='Graveyard'
                    style={{width: '150px', height: '200px'}}
                />
            ):(
                <div>No cards in graveyard </div>
            )}
        </div>
    </div>
);

const Hand = ({ player, onCardClick, minimized, toggleMinimize }) => (
    <div style={{
        position: 'fixed',
        bottom: minimized ? '-150px' : '0',
        left: '0',
        width: '100%',
        backgroundColor: '#f4f4f4',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px', 
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'bottom 0.3s ease', // smooth transition
    }}>
        <button
            onClick={toggleMinimize}
            style={{ 
                position: 'fixed', 
                bottom: minimized ? '10px' : '220px', 
                left: '5%', 
                transform: 'translateX(-50%)', 
                cursor: 'pointer',
                zIndex: '100'
             }}
        >
            {minimized ? 'Show Hand' : 'Hide Hand'}
        </button>

        {!minimized && (
            <>
                {player.hand && player.hand.length > 0 ? (
                    player.hand.map((card, index) => (
                        <div
                            key={index}
                            style={{ margin: '0 10px', textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => onCardClick(player, card)} // handle card click
                        >
                            <img
                                src={card.imageUrl}
                                alt={card.name}
                                style={{ width: '150px', height: '200px' }}
                            />
                            <div>{card.name}</div>
                        </div>
                    ))
                ) : (
                    <div>No Cards in Hand.</div>
                )}
            </>
        )}
    </div>
);

// Card Popup component
const CardPopup = ({ card, onClose, onSendToGraveyard, onTapToggle, onPlayCard, onReturnCard }) => {
    if (!card) return null;

    

    return (
        <div style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -10%)',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
        }}>
            <div style={{ textAlign: 'right' }}>
                <button onClick={onReturnCard}>Return to Hand</button>
                <button onClick={onClose}>Close</button>
            </div>
            <div style={{ textAlign: 'center' }}>
                <img src={card.imageUrl} alt={card.name} style={{ width: '300px', height: '400px' }} />
                <div>{card.name}</div>

                {/* Button to play the card to the battlefield */}
                <button onClick={onPlayCard}>Play to Battlefield</button>

                {/* Button to send the card to the graveyard */}
                <button onClick={onSendToGraveyard}>Send to Graveyard</button>

                {/* Button to tap/untap the card */}
                <button onClick={onTapToggle}>
                    {card.tapped ? 'Untap' : 'Tap'}
                </button>
            </div>
        </div>
    );
};


// Main Game Component 
const Game = () => {
    const { players, currentTurn, phase, advanceToNextPhase, setPlayers } = useGame();
    const [handMinimized, setHandMinimized] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const currentPlayer = players[currentTurn];
    const opponentPlayer = players[(currentTurn + 1) % players.length];

    const magicCardBackUrl = 'https://th.bing.com/th/id/OIP.EreTyzqOK6LpVYsaqDjp1wHaKF?w=202&h=275&c=7&r=0&o=5&dpr=1.1&pid=1.7';


    const adjustLife = (player, amount) => {
        setPlayers(players.map(p =>
            p.name === player.name ? { ...p, life: p.life + amount } : p
        ));
    };


    const drawCard = (player) => {
        //Check if the player has any cards left in the deck
        if(player.deck.length > 0){
            const newCard = player.deck[0];
            const newDeck = player.deck.slice(1);

            // update the players state with the new card in hand and updated deck
            setPlayers(players.map(p => {
                if(p.name === player.name){
                    return{
                        ...p,
                        hand: [...p.hand, newCard], // Add Drawn card to hand
                        deck: newDeck // update the deck after drawing
                    };
                }
                return p;
            }));
        }else{
            alert(`${player.name}'s deck is empty!`);
        }
    }

    const checkOutCard = (card) => {
        setSelectedCard(card);
    };

    const handleCardClick = (player, card) => {
        setSelectedCard(card);
    };

    const playCardToBattlefield = (player, card) => {
        setPlayers(players.map(p => {
            if(p.name === player.name){
                return{
                    ...p,
                    hand: p.hand.filter(c=> c !== card),
                    battlefield: [...p.battlefield, card],
                };
            }
            return p;
        }));
        setSelectedCard(null);
    };

    const returnCardToHand = (player, card) => {
        setPlayers(players.map(p => {
            return {
                ...p,
                battlefield: p.battlefield.filter(c=> c!== card),
                hand: [...p.hand, card], // return card to hand
            };
            return p;
        }));
        setSelectedCard(null);
    };

    const toggleMinimize = () => {
        setHandMinimized(!handMinimized);
    };

    // Function to send the the selected card to the graveyard
    //
    const sendToGraveYard = (player, card) => {
        setPlayers(players.map(p => {
            // check if the current player is the one who owns the card
            if(p.name === player.name){
                //Update the player's battlefield
                //Update the graveyard by adding selected card
                return{
                    ...p,
                    battlefield: p.battlefield.filter(c => c !== card),
                    graveyard: [...p.graveyard, card],
                };

            };
            return p; // No change for other players
        }));
        //Close the popup after the card is sent to the graveyard
        setSelectedCard(null);
    }

    const toggleTappedState = (player, card) => {
        setPlayers(players.map(p => {
            if (p.name === player.name) {
                return {
                    ...p,
                    battlefield: p.battlefield.map(c =>
                        c === card ? { ...c, tapped: !c.tapped } : c
                    ),
                };
            }
            return p;
        }));
        setSelectedCard(null);
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            <h1>Current Player: {currentPlayer.name}</h1>

            {/* Opponent's  battlefield */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Battlefield cards={opponentPlayer.battlefield} rotate={true}  onCardClick= {checkOutCard} isCurrentPlayer={false}/>
                </div>

                {/* Opponent's Deck and Graveyard */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
                    <Graveyard graveyard={opponentPlayer.graveyard} />
                    <Deck imageUrl={magicCardBackUrl} onDrawCard={()=> drawCard(opponentPlayer)}/>
                </div>
            </div>

            {/* Game Phase and Next Phase Button and Life totals*/}
            <div style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                backgroundColor: '#f0f0f0',
                padding: '0px',
                textAlign: 'center',
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
            }}>
                <h2>Current Phase: {phase}</h2>
                <button onClick={advanceToNextPhase}>Next Phase</button>
                <LifeTotal player={opponentPlayer} adjustLife={adjustLife} />
                <LifeTotal player={currentPlayer} adjustLife={adjustLife} />
            </div>

            {/* Current player's battlefield */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Battlefield cards={currentPlayer.battlefield} rotate={false} onCardClick={checkOutCard} isCurrentPlayer={true}/>
            </div>

            {/* Current player's Deck and Graveyard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* Player's hand at the bottom */}
                <Hand 
                    player={currentPlayer} 
                    onCardClick={handleCardClick} 
                    minimized={handMinimized}
                    toggleMinimize={toggleMinimize}
                />

                {/* Player's Deck and Graveyard */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
                    <Graveyard graveyard={currentPlayer.graveyard} />
                    <Deck imageUrl={magicCardBackUrl} onDrawCard={() => drawCard(currentPlayer)} />
                </div>
            </div>

            {/*Card Popup*/}
            <CardPopup
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                    onSendToGraveyard={() => sendToGraveYard(currentPlayer, selectedCard)}
                    onTapToggle={() => toggleTappedState(currentPlayer, selectedCard)} // Add this function to toggle tapped state
                    onPlayCard={() => playCardToBattlefield(currentPlayer, selectedCard)}
                    onReturnCard = {() => returnCardToHand(currentPlayer, selectedCard)}
                />
        </div>
    );
};

export default Game;