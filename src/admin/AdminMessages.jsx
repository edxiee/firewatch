import React from "react";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminMessages() {
  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">Admin Messages</div>
      </div>
      <div className="content">
        <div className="welcome-section">
          <h2 className="services-header">User Reports</h2>
          <div className="header-line"></div>
          <p className="services-subtitle">Recent emergency messages from the community.</p>
        </div>
        <div className="services-grid">
          <div className="service-box">
            <div className="service-text">
              <p style={{textAlign: "center", color: "#666"}}>No new messages to display.</p>
            </div>
          </div>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}