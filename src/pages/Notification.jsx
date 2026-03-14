import React from 'react';
import { useNavigate } from "react-router-dom";
import '../index.css'; // Ensure this points to your global styles

const Notification = () => {
  const navigate = useNavigate();

  return (
    <div className="homescreen">
      <header className="top-bar">Notification</header>
      <main className="content">
        <div className="notif-card">
          <strong>🔥 Fire Detected Nearby</strong>
          <p>320m from Brgy. Batasan Hills.</p>
        </div>
        <div className="notif-card">
          <strong>✅ Alert Cleared</strong>
          <p>Fire contained in Payatas.</p>
        </div>
      </main>
      <nav className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate('/home')}>🏠</button>
        <button className="nav-btn" onClick={() => navigate('/messages')}>💬</button>
        <button className="nav-btn active" onClick={() => navigate('/notifications')}>🔔</button>
        <button className="nav-btn" onClick={() => navigate('/profile')}>👤</button>
      </nav>
    </div>
  );
};
export default Notification;