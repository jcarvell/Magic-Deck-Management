// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchDecks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/decks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching decks:', error);
    throw error; // Re-throw error to handle it where fetchDecks is called
  }
};
