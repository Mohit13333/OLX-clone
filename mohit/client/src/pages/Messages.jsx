import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const Messages = () => {
  const { authToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      const { _id } = jwtDecode(authToken);
      setUserId(_id);
    }
  }, [authToken]);

  useEffect(() => {
    if (userId) {
      axios.get(`https://olx-clone-fwgz.onrender.com/chat/user/${userId}`)
        .then((response) => setChats(response.data))
        .catch((error) => console.error('Error fetching chats:', error));
    }
  }, [userId]);

  const handleChatClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div style={styles.container}>
      <h1>Messages</h1>
      {chats.map((chat, index) => (
        <div key={index} style={styles.chat} onClick={() => handleChatClick(chat.roomId)}>
          <div style={styles.chatHeader}>
            <strong>{chat.otherUserName}</strong>
          </div>
          <div style={styles.chatMessage}>
            {chat.lastMessage}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    height: '100vh'
  },
  chat: {
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: '10px',
    cursor: 'pointer'
  },
  chatHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  chatMessage: {
    fontSize: '16px',
    color: '#555'
  }
};

export default Messages;