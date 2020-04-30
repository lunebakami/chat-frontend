import React, { useState, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { MdAccessTime } from 'react-icons/md';
import { format, parseISO } from 'date-fns';

import './styles.css';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const username = localStorage.getItem('username');
  const { setAuthTokens } = useAuth();

  const history = useHistory();

  useEffect(() => {
    async function loadMessages() {
      const response = await api.get('/messages');

      setMessages(response.data);
    }

    loadMessages();
  }, [messages]);

  function handleLogout() {
    setAuthTokens();
    localStorage.removeItem('username');
    localStorage.removeItem('tokens');
    history.push('/');
  }

  async function handleMessage(e) {
    e.preventDefault();

    try {
      const user = await api.get(`/users/${username}`);

      await api.post('/messages', { content: message, user: user.data._id });
    } catch (error) {
      alert('Error on sending message');
    }
  }

  return (
    <>
      <div className="header">
        <h1>Hello {username}</h1>
        <button
          id="logout"
          onClick={() => {
            handleLogout();
          }}
        >
          <FiLogOut />
        </button>
      </div>
      <div className="chat">
        <ul className="messages">
          {messages.map((msg) => (
            <li
              className={
                msg.user.username === username ? 'user-message' : 'message'
              }
              key={msg._id}
            >
              <span id="userinfo">
                <span id="username">{msg.user.username}</span>
                <span id="date">
                  <MdAccessTime />
                  {format(parseISO(msg.createdAt), 'H:m d/M/yy')}
                </span>
              </span>
              <span id="message-content">{msg.content}</span>
            </li>
          ))}
        </ul>

        <form className="send-message" onSubmit={(e) => handleMessage(e)}>
          <textarea
            maxLength="228"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit" id="send-button">
            <AiOutlineSend />
          </button>
        </form>
      </div>
    </>
  );
}
