import React from 'react';
import { useNavigate } from "react-router-dom";
import './Notification.css'; 

const Notification = () => {
  const navigate = useNavigate();

  return (
    <div className="homescreen">
      {/* HEADER SECTION - Now matches Home/Emergency structure */}
      <header className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Notification</div>
      </header>

      {/* MAIN CONTENT */}
      <main className="content">
        <div className="notif-card">
          <strong>🔥 Fire Detected Nearby</strong>
          <p>320m from Brgy. Batasan Hills.</p>
        </div>
        
        <div className="notif-card success">
          <strong>✅ Alert Cleared</strong>
          <p>Fire contained in Payatas.</p>
        </div>
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate("/home")} aria-label="Home">
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
        </button>

        <button className="nav-btn" onClick={() => navigate("/emergency")} aria-label="Emergency">
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
        </button>
        
        <button className="nav-btn" onClick={() => navigate("/message")} aria-label="Chat">
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M4 4h16v12H5.17L4 17.17V4z" /></svg>
        </button>

        {/* ACTIVE STATE ON NOTIFICATION */}
        <button className="nav-btn active" onClick={() => navigate("/notification")} aria-label="Notifications">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" />
          </svg>
        </button>

        <button className="nav-btn" onClick={() => navigate("/profile")} aria-label="Profile">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;