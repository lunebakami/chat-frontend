import React, { useState, useEffect } from 'react';
import { FiLogOut, FiSearch, FiTrash } from 'react-icons/fi';
import { MdAccessTime } from 'react-icons/md';
import { format, parseISO } from 'date-fns';

import './styles.css';
import api from '../../services/api';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export default function ChatAdmin() {
  const [messages, setMessages] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const username = localStorage.getItem('username');
  const { setAuthTokens, authTokens } = useAuth();

  useEffect(() => {
    async function loadMessages() {
      const response = await api.get('/messages');

      setMessages(response.data);
    }

    loadMessages();
  }, []);

  function handleLogout() {
    setAuthTokens();
    localStorage.removeItem('username');
    localStorage.removeItem('tokens');
    return <Redirect to="/signin_admin" />;
  }

  async function handleSearch(e) {
    e.preventDefault();

    try {
      let data = {};
      if (searchUsername) {
        data = {
          username: searchUsername,
        };
      }

      if (searchDate) {
        data = {
          ...data,
          date: searchDate,
        };
      }

      const result = await api.get('/search', {
        params: data,
        headers: {
          authorization: authTokens,
        },
      });

      setMessages(result.data);
    } catch (error) {
      alert('Error on searching');
    }
  }

  async function deleteMessage({ _id }) {
    try {
      await api.delete(`/messages/${_id}`, {
        headers: {
          authorization: authTokens,
        },
      });

      const result = await api.get('/messages');

      setMessages(result.data);

      alert('Message deleted');
    } catch (error) {
      alert('Error deleting message');
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
      <div className="chat-admin">
        <ul className="messages-admin">
          {messages.map((msg) => (
            <li className="message" key={msg._id}>
              <div className="user-container">
                <span id="userinfo">
                  <span id="username">{msg.user.username}</span>
                  <span id="date">
                    <MdAccessTime />
                    {format(parseISO(msg.createdAt), 'H:m d/M/yy')}
                  </span>
                </span>
                <p id="message-content">{msg.content}</p>
              </div>
              <button
                id="delete"
                onClick={() => {
                  deleteMessage(msg);
                }}
              >
                <FiTrash size={14} />
              </button>
            </li>
          ))}
        </ul>
        <div className="search">
          <form
            onSubmit={(e) => {
              handleSearch(e);
            }}
          >
            <input
              type="text"
              value={searchUsername}
              placeholder="put a username here"
              onChange={(e) => {
                setSearchUsername(e.target.value);
              }}
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
              }}
            />
            <button type="submit">
              <FiSearch size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
