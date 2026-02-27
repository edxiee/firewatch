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