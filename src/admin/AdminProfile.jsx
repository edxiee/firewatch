import React from "react";
import { auth } from "../firebase"; // This stays ../ because firebase.js is in /src
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; // Changed from ../ to ./

export default function AdminProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/"));
  };

  return (
    <div className="homescreen">
      <div className="top-bar"><div className="top-title">Admin Profile</div></div>
      <div className="content">
        <div className="services-grid" style={{marginTop: "20px"}}>
          <div className="service-box">
            <div className="service-text">
              <h3>Admin Identity</h3>
              <p>{auth.currentUser?.email}</p>
            </div>
          </div>
          <button className="read-more-btn" onClick={() => navigate("/home")} style={{margin: "10px"}}>
            Switch to User View
          </button>
          <button className="read-more-btn" onClick={handleLogout} style={{borderColor: "#666", color: "#666"}}>
            Logout
          </button>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}