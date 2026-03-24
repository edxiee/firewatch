import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar.jsx";
import "./AdminProfile.css";

export default function AdminProfile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        setTotalUsers(userSnap.size);

        const alertSnap = await getDocs(collection(db, "emergencies"));
        setTotalAlerts(alertSnap.size);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">Admin Control Center</div>
      </div>

      <div className="content">
        <div className="profile-card">
          <div className="avatar-circle">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <h2 className="admin-name">Admin Identity</h2>
          <p className="admin-email">{user?.email}</p>
          <span className="role-badge">Super Admin</span>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalAlerts}</span>
            <span className="stat-label">Total Alerts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Active</span>
            <span className="stat-label">System</span>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title">Account Management</h3>
          
          <button className="settings-btn" onClick={() => navigate("/admin/create-account")}>
            <div className="btn-content">
              <span>➕ Register New Admin Account</span>
              <small>Create access for other fire officers</small>
            </div>
          </button>

          {/* New Button for User Management */}
          <button className="settings-btn" onClick={() => navigate("/admin/users")}>
            <div className="btn-content">
              <span>👥 Manage Registered Users</span>
              <small>View, search, or remove app users</small>
            </div>
          </button>

          <button className="logout-btn-alt" onClick={handleLogout}>
            Logout Account
          </button>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}