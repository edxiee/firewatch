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
        <div className="home-content">
          <header className="firewatch-header">
            <img src="/Logo.png" alt="Logo" className="header-logo" />
            <h1 className="header-title">FIRE WATCH</h1>
          </header>

          <main className="main-content">
            <section className="map-container">
              <h2 className="section-title">Your Current Location</h2>
              <img src="https://via.placeholder.com/400x250" alt="Map" className="map-image" />
            </section>

            <section className="emergency-section">
              <h2 className="section-title">Tap For Fire Emergency</h2>
              <button className="emergency-button" onClick={handleEmergency}>
                <img src="/Logo.png" alt="Emergency" className="button-logo" />
                <span className="button-text">FIRE WATCH</span>
              </button>
            </section>
          </main>
        </div>
      )}

      {/* --- PROFILE VIEW --- */}
      {activeTab === 'profile' && (
        <div className="profile-screen">
          <div className="profile-avatar">👤</div>
          <div className="details-header"><h2>PERSONAL DETAILS</h2></div>
          <div className="details-list">
            <div className="detail-box"><span>FULLNAME:</span> <strong>Arfred Salonga</strong></div>
            <div className="detail-box"><span>EMAIL:</span> <strong>arfredsalonga@gmail.com</strong></div>
            <div className="detail-box"><span>PASSWORD:</span> <strong>**********</strong></div>
            <div className="detail-box"><span>CONTACT NO.:</span> <strong>09123456789</strong></div>
            <div className="detail-box"><span>ADDRESS:</span> <strong>3b Kalayaan St. Ampid 1 QC</strong></div>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('home')}>🏠</button>
        <button>💬</button>
        <button>🔔</button>
        <button onClick={() => setActiveTab('profile')}>👤</button>
      </nav>
    </div>
  );
};

export default HomeScreen;