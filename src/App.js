// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeckListPage from './components/DeckListPage';
import LoginForm from './components/LoginForm';
import DeckManagement from './components/DeckManagement';
import OptionsPage from './components/OptionsPage';
import ViewDecks from './components/ViewDecks';
import StartGame from './components/StartGame';
import EditDecks from './components/EditDecks';
import AddCards from './components/AddCards';
import SearchCardImage from './components/SearchCardImage';
import { UserProvider } from './UserContext'; // Import UserProvider
import { GameProvider } from './components/GameContext';
import Game from './components/Game'; // Make sure to import your Game component

const App = () => {
  return (
    <UserProvider> {/* Wrap your entire app in the UserProvider */}
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/decks" element={<DeckListPage />} />
            <Route path="/deck-management" element={<DeckManagement />} />
            <Route path="/options" element={<OptionsPage />} />
            <Route path="/game" element={<Game />} />
            <Route path="/start-game" element={<StartGame />} />
            <Route path="/view-decks" element={<ViewDecks />} />
            <Route path="/edit-decks" element={<EditDecks />} />
            <Route path="/add-cards" element={<AddCards />} />
            <Route path="/search-card-image" element={<SearchCardImage />} />
          </Routes>
        </Router>
      </GameProvider>
    </UserProvider>
  );
};

export default App;
