import React from 'react';
import UserNavBar from './UserNavBar'; // Import the shared bar
import './Notification.css'; 

const Notification = () => {
  return (
    <div className="homescreen">
      {/* HEADER SECTION */}
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

      {/* Shared Uniform Navbar */}
      <UserNavBar />
    </div>
  );
};

export default Notification;