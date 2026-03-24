import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Added useNavigate
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AdminNavbar from "./AdminNavbar.jsx";
import "./AdminScreen.css"; 

export default function AdminScreen() {
  const [activeEmergency, setActiveEmergency] = useState(null);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    // Listen for ANY active emergency in real-time
    const q = query(collection(db, "emergencies"), where("status", "==", "active"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        const id = snapshot.docs[0].id;
        setActiveEmergency({ id, ...docData });

        // Trigger the Alarm Sound
        const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-emergency-alert-alarm-1007.mp3");
        audio.play().catch(err => console.log("Playback waiting for user interaction"));
      } else {
        setActiveEmergency(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="homescreen">
      {/* EMERGENCY OVERLAY */}
      {activeEmergency && (
        <div className="emergency-overlay">
          <div className="emergency-modal">
            <div className="flashing-icon">🚨</div>
            <h1>FIRE EMERGENCY REPORTED</h1>
            <div className="emergency-details">
              <p><strong>User:</strong> {activeEmergency.userEmail}</p>
              <p><strong>Location:</strong> {activeEmergency.latitude}, {activeEmergency.longitude}</p>
            </div>
            <button 
              className="action-btn" 
              onClick={() => {
                setActiveEmergency(null); // Clear modal state
                navigate("/admin/notifications"); // 3. Corrected path from App.jsx
              }}
            >
              VIEW DETAILS & MAP
            </button>
          </div>
        </div>
      )}

      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="Logo" />
        <div className="top-title">Admin Dashboard</div>
      </div>

      <div className="content">
        <div className="welcome-section">
          <h2 className="services-header">System Overview</h2>
          <div className="header-line"></div>
          <p className="services-subtitle">Monitor community safety and reports.</p>
        </div>

        <div className="services-grid">
           <div className="service-box">
              <h3>Total Reports</h3>
              <p>Check the notification tab for history.</p>
           </div>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
}