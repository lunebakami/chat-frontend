import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';
import { useAuth } from '../../context/auth';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const { setAuthTokens } = useAuth();

  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.get(`/users/${username}`);

      localStorage.setItem('username', response.data.username);
      setAuthTokens(response.data.username);
      history.push('/chat');
    } catch (e) {
      const response = await api.post('/users', { username });

      setAuthTokens(response.data.token);
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
          required
        />
        <button type="submit">Sign In</button>
        <button>
          <Link to="/signin_admin">Sign In as an Admin</Link>
        </button>
      </form>
    </div>
  );
}
