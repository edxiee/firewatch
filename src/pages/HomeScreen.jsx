<<<<<<< HEAD
import React, { useState } from 'react'; // Added useState here
import './HomeScreen.css';
import logo from '/Logo.png'; 

const HomeScreen = () => {
  // 1. Define the state to handle navigation switching
  const [activeTab, setActiveTab] = useState('home');

  const handleEmergency = () => {
    alert("Emergency Alert Sent!");
  };

  return (
    <div className="firewatch-container">
      
      {/* --- HOME VIEW --- */}
      {activeTab === 'home' && (
        <>
          <header className="firewatch-header">
            <img src={logo} alt="Logo" className="header-logo" />
            <h1 className="header-title">Fire Watch</h1>
          </header>

          <main className="main-content">
            <section className="map-container">
              <h2 className="section-title">Your Current Location</h2>
              <div className="map-wrapper">
                <img 
                  src="https://via.placeholder.com/400x250?text=Map+Placeholder" 
                  alt="Current Location Map" 
                  className="map-image"
                />
              </div>
            </section>

            <section className="emergency-section">
              <h2 className="section-title">Tap For Fire Emergency</h2>
              <button className="emergency-button" onClick={handleEmergency}>
                <img src={logo} alt="Emergency" className="button-logo" />
                <span className="button-text">Fire Watch</span>
              </button>
            </section>
          </main>
        </>
      )}

      {/* --- PROFILE VIEW (Matched to your image) --- */}
      {activeTab === 'profile' && (
        <div className="profile-screen">
          <div className="profile-content">
            <div className="profile-avatar-large">
              {/* Default profile icon if user-icon.png doesn't exist */}
              <div className="avatar-placeholder">👤</div>
            </div>

            <div className="details-header">
              <h2>PERSONAL DETAILS</h2>
            </div>

            <div className="details-list">
              <div className="detail-box">
                <span className="label">FULLNAME:</span>
                <span className="value">Arfred Salonga</span>
              </div>
              <div className="detail-box">
                <span className="label">EMAIL:</span>
                <span className="value">arfredsalonga@gmail.com</span>
              </div>
              <div className="detail-box">
                <span className="label">PASSWORD:</span>
                <span className="value">**********</span>
              </div>
              <div className="detail-box">
                <span className="label">CONTACT NO. :</span>
                <span className="value">09123456789</span>
              </div>
              <div className="detail-box">
                <span className="label">ADDRESS:</span>
                <span className="value">3b Kalayaan St. Ampid 1 QC</span>
              </div>
            </div>

            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => setActiveTab('home')}>🏠</button>
        <button className="nav-item">💬</button>
        <button className="nav-item">🔔</button>
        <button className="nav-item" onClick={() => setActiveTab('profile')}>👤</button>
      </nav>
      
    </div>
  );
};

export default HomeScreen;
=======
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

        <button
          className="emergency-circle"
          onClick={handleEmergency}
          type="button"
        >
          <img className="emergency-logo" src="/Logo.png" alt="FireWatch" />
        </button>
      </div>

      {/* bottom nav */}
      <div className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate("/home")}>
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
          </svg>
        </button>

        <button className="nav-btn">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M4 4h16v12H5.17L4 17.17V4z" />
          </svg>
        </button>

        <button className="nav-btn">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" />
          </svg>
        </button>

        <button className="nav-btn" onClick={() => navigate("/profile")}>
          <svg viewBox="0 0 24 24" className="nav-icon">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
>>>>>>> ed
