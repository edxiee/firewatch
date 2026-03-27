import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, getCountFromServer } from "firebase/firestore";
import AdminNavbar from "./AdminNavbar.jsx";
import "./AdminScreen.css"; 

export default function AdminScreen() {
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [stats, setStats] = useState({ reports: 0, users: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Real-time Emergency Listener
    const q = query(collection(db, "emergencies"), where("status", "==", "active"));
    const unsubscribeEmergencies = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        const id = snapshot.docs[0].id;
        setActiveEmergency({ id, ...docData });

        const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-emergency-alert-alarm-1007.mp3");
        audio.play().catch(() => console.log("Audio waiting for interaction"));
      } else {
        setActiveEmergency(null);
      }
    });

    // 2. Fetch Stats (Total Reports & Users)
    const fetchStats = async () => {
      const reportsColl = collection(db, "emergencies");
      const usersColl = collection(db, "users");
      
      const reportCount = await getCountFromServer(reportsColl);
      const userCount = await getCountFromServer(usersColl);
      
      setStats({
        reports: reportCount.data().count,
        users: userCount.data().count
      });
    };

    fetchStats();
    return () => unsubscribeEmergencies();
  }, []);

  return (
    <div className="admin-layout">
      {/* EMERGENCY OVERLAY */}
      {activeEmergency && (
        <div className="emergency-overlay">
          <div className="emergency-modal">
            <div className="flashing-icon">🚨</div>
            <h1>FIRE EMERGENCY!</h1>
            <div className="emergency-details">
              <p><strong>User:</strong> {activeEmergency.userEmail}</p>
              <p><strong>Location:</strong> {activeEmergency.latitude}, {activeEmergency.longitude}</p>
            </div>
            <button className="view-details-btn" onClick={() => navigate("/admin/notifications")}>
              RESPOND NOW
            </button>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="admin-top-bar">
        <img className="top-logo" src="/Logo.png" alt="Logo" />
        <div className="top-title">Command Center</div>
      </div>

      <div className="admin-content">
        <div className="welcome-section">
          <h2 className="services-header">System Overview</h2>
          <div className="header-line"></div>
          <p className="services-subtitle">Real-time community monitoring</p>
        </div>

        {/* STATS GRID - Ensure these are wrapped in 'stats-grid' */}
        <div className="stats-grid">
          <div className="stat-card urgent">
            <span className="stat-value">{activeEmergency ? "1" : "0"}</span>
            <span className="stat-label">Active Fires</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.users}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.reports}</span>
            <span className="stat-label">Total Logs</span>
          </div>
          <div className="stat-card chat-card" onClick={() => navigate("/admin/messages")}>
            <span className="stat-value">Chat</span>
            <span className="stat-label">Support</span>
          </div>
        </div>

        {/* QUICK ACTIONS - Ensure these are wrapped in 'action-row' */}
        <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-row">
            <button className="action-tile" onClick={() => navigate("/admin/notifications")}>
              📢 <span>Send Alert</span>
            </button>
            <button className="action-tile" onClick={() => navigate("/admin/users")}>
              👥 <span>Users</span>
            </button>
            <button className="action-tile" onClick={() => navigate("/admin/create-account")}>
              🔑 <span>Add Admin</span>
            </button>
          </div>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
}