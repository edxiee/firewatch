import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

export default function HomeScreen() {
  const navigate = useNavigate();

  const handleEmergency = () => alert("Emergency Alert Sent!");

  return (
    <div className="homescreen">
      {/* top bar */}
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">FireWatch</div>
      </div>

      {/* content */}
      <div className="content">
        <div className="location-title">Your Current Location</div>

        <div className="map-frame">
          <iframe
            className="map-iframe"
            title="map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=121.040%2C14.620%2C121.070%2C14.640&layer=mapnik"
          />
        </div>

        <div className="emergency-title">Tap For Fire Emergency</div>

        <button className="emergency-circle" onClick={handleEmergency} type="button">
          <img className="emergency-logo" src="/Logo.png" alt="FireWatch" />
        </button>
      </div>

      {/* bottom nav */}
      <div className="bottom-bar">
        <button className="nav-btn" type="button" onClick={() => navigate("/home")} aria-label="Home">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
          </svg>
        </button>

        <button className="nav-btn" type="button" aria-label="Chat">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M4 4h16v12H5.17L4 17.17V4z" />
          </svg>
        </button>

        <button className="nav-btn" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" />
          </svg>
        </button>

        <button className="nav-btn" type="button" onClick={() => navigate("/profile")} aria-label="Profile">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}