import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';

export default function SignIn() {
  const [username, setUsername] = useState('');

  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.get(`/users/${username}`);

      localStorage.setItem('username', response.data.username);
      history.push('/chat');
    } catch (e) {
      const response = await api.post('/users', { username });

      localStorage.setItem('username', response.data.username);
      history.push('/chat');
    }
  }

  return (
    <div className="signin-container">
      <form
        onSubmit={(e) => {
          handleLogin(e);
        }}
      >
        <input
          type="text"
          placeholder="Put your username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
