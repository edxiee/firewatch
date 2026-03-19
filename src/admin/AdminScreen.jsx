import React from "react";
import AdminNavbar from "./AdminNavbar.jsx";
export default function AdminScreen() {
  return (
    <div className="homescreen">
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="Logo" />
        <div className="top-title">Admin Dashboard</div>
      </div>
      <div className="content">
        <div className="welcome-section">
          <h2 className="services-header">System Overview</h2>
          <div className="header-line"></div>
          <p className="services-subtitle">Monitor fire reports and user activity.</p>
        </div>
        <div className="services-grid">
           <div className="service-box">
             <div className="service-text">
               <h3>Active Alerts</h3>
               <p>0 Emergency reports currently active.</p>
             </div>
           </div>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}