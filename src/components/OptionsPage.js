import React from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import {useUser} from '../UserContext';

const OptionsPage = ({}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useUser();

    // const username = location.state?.username;

    const handleStartGame = () => navigate('/start-game');
    const handleViewDecks = () => navigate('/view-decks');
    const handleEditDecks = () => navigate('/edit-decks');
    const handleAddNewCards = () => navigate('/add-cards');

    return(
        <div>
            <h1>Choose an Option, {user?.username} Thank you</h1>
            <button onClick={handleStartGame}>Start Game</button>
            <button onClick={handleViewDecks}>View Decks</button>
            <button onClick={handleEditDecks}>Edit Decks</button>
            <button onClick={handleAddNewCards}>Add New Cards</button>

        </div>
    );
};

export default OptionsPage;