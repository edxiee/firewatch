import React from 'react';
import { useNavigate } from "react-router-dom";
import '../index.css';

const Message = () => {
  const navigate = useNavigate();

  return (
    <div className="homescreen">
      <header className="top-bar">Emergency Chat</header>
      <main className="content">
        <div className="chat-bubble received">Unit QC-3 Dispatched...</div>
      </main>
      {/* Input area positioned above the bottom bar */}
      <footer className="chat-input-row">
        <input type="text" placeholder="Type Message..." />
        <button>➤</button>
      </footer>
      <nav className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate('/home')}>🏠</button>
        <button className="nav-btn active" onClick={() => navigate('/messages')}>💬</button>
        <button className="nav-btn" onClick={() => navigate('/notifications')}>🔔</button>
        <button className="nav-btn" onClick={() => navigate('/profile')}>👤</button>
      </nav>
    </div>
  );
};
export default Message;