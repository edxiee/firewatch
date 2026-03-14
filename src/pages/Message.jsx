import React from 'react';
import { useNavigate } from "react-router-dom";
import './Message.css';

const Message = () => {
  const navigate = useNavigate();

  return (
    <div className="homescreen">
      {/* Top Bar */}
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Chat</div>
      </div>

      <main className="content">
        <div className="chat-bubble received">Unit QC-3 Dispatched...</div>
      </main>

      {/* Input area positioned above the bottom bar */}
      <footer className="chat-input-row">
        <input type="text" placeholder="Type Message..." />
        <button type="button">➤</button>
      </footer>

      {/* BOTTOM BAR (Updated with SVG Icons and correct routing) */}
      <div className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate("/home")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
        </button>
        <button className="nav-btn" onClick={() => navigate("/emergency")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
        </button>

        {/* MOVE 'active' HERE */}
        <button className="nav-btn active" onClick={() => navigate("/message")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M4 4h16v12H5.17L4 17.17V4z" /></svg>
        </button>

        {/* REMOVE 'active' FROM HERE */}
        <button className="nav-btn" onClick={() => navigate("/notification")}>
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" />
          </svg>
        </button>

        <button className="nav-btn" onClick={() => navigate("/profile")}>
          <svg viewBox="0 0 24 24" className="nav-icon">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Message;