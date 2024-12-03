import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useUser} from '../UserContext';


// const API_BASE_URL = "http://localhost:7208/api"
const API_BASE_URL = "http://165.227.124.129:5000"


const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const {setUser} = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        const response = await axios.post(`${API_BASE_URL}/users`, { Username: username });
        // adding this to check the response.
        console.log(response.data);

        if (response.data) {

          // Redirect the user to the options page
          // set the user in context 
         setUser(response.data);
         navigate('/options');
        }
      } 
      catch (error) {
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        } else {
          console.error('Error:', error.message);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default LoginForm;
