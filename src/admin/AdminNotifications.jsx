import React from "react";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminNotifications() {
  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">Broadcast Alerts</div>
      </div>
      <div className="content">
        <div className="welcome-section">
          <h2 className="services-header">Push Notifications</h2>
          <div className="header-line"></div>
          <p className="services-subtitle">Send emergency alerts to all users.</p>
        </div>
        <div className="services-grid">
          <button className="submit-btn" style={{marginTop: "20px"}}>
            Send Fire Alert Broadcast
          </button>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}