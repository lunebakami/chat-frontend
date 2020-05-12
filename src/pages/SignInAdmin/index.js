import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';
import { useAuth } from '../../context/auth';

export default function SignInAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const { setAuthTokens, authTokens } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.post('/sessions', { username, password });

      if (response.status === 200) {
        localStorage.setItem('username', response.data.admin.username);
        setAuthTokens(response.data.token);
        setLoggedIn(true);
      }
    } catch (e) {
      setIsError(true);
    }
  }

  if (isLoggedIn || authTokens) {
    return <Redirect to="/chat_admin" />;
  }

  return (
    <>
      {isError && (
        <span style={{ color: '#ff2233' }}>
          The username or password provided were incorrect!
        </span>
      )}
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

          <input
            type="password"
            placeholder="Put your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </>
  );
}
