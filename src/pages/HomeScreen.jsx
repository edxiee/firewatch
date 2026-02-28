import React, { useState } from 'react';
import './HomeScreen.css';

const HomeScreen = () => {
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
            <img src="/Logo.png" alt="Logo" className="header-logo" />
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
                <img src="/Logo.png" alt="Emergency" className="button-logo" />
                <span className="button-text">Fire Watch</span>
              </button>
            </section>
          </main>
        </>
      )}

      {/* --- PROFILE VIEW --- */}
      {activeTab === 'profile' && (
        <div className="profile-screen">
          <div className="profile-avatar-large">👤</div>
          <div className="details-header"><h2>PERSONAL DETAILS</h2></div>
          <div className="details-list">
            <div className="detail-box"><span className="label">FULLNAME:</span><span className="value">Arfred Salonga</span></div>
            <div className="detail-box"><span className="label">EMAIL:</span><span className="value">arfredsalonga@gmail.com</span></div>
            <div className="detail-box"><span className="label">CONTACT NO. :</span><span className="value">09123456789</span></div>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
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