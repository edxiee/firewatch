import React from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../components/navigation/UserNavBar.jsx";
import "./HomeScreen.css";

// --- SVG ICONS ---
const FireIcon = () => (
  <svg viewBox="0 0 24 24" className="user-home-screen-service-icon">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 3.03-3.08 7.37-5 9.77C10.08 16.37 7 12.03 7 9z"/>
    <path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="user-home-screen-service-icon">
    <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" className="user-home-screen-service-icon">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="user-home-screen-service-icon">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="user-home-screen">
      {/* TOP BAR - 64px height with Logo */}
      <div className="user-home-screen-top-bar">
        <img className="user-home-screen-logo" src="./Logo.png" alt="FireWatch Logo" />
        <div className="user-home-screen-title">FireWatch</div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="user-home-screen-content">
        <div className="user-home-screen-welcome-section">
          <h2 className="user-home-screen-header">Our Services</h2>
          <div className="user-home-screen-header-line"></div>
          <p className="user-home-screen-subtitle">
            Your safety is our priority. Explore how FireWatch helps you.
          </p>
        </div>

        <div className="user-home-screen-services-grid">
          {/* SERVICE 1: FIRE PREVENTION */}
          <div className="user-home-screen-service-box" onClick={() => navigate('/emergency')}>
            <div className="user-home-screen-icon-circle">
              <FireIcon />
            </div>
            <div className="user-home-screen-service-text">
              <h3>FIRE PREVENTION</h3>
              <p>Safety tips and emergency preparedness guides.</p>
            </div>
            <div className="user-home-screen-arrow">
              <ArrowIcon />
            </div>
          </div>

          {/* SERVICE 2: NOTIFICATION */}
          <div className="user-home-screen-service-box" onClick={() => navigate('/notification')}>
            <div className="user-home-screen-icon-circle">
              <BellIcon />
            </div>
            <div className="user-home-screen-service-text">
              <h3>Notification</h3>
              <p>Allow our notification features to keep you informed.</p>
            </div>
            <div className="user-home-screen-arrow">
              <ArrowIcon />
            </div>
          </div>

          {/* SERVICE 3: MESSAGES */}
          <div className="user-home-screen-service-box" onClick={() => navigate('/message')}>
            <div className="user-home-screen-icon-circle">
              <ChatIcon />
            </div>
            <div className="user-home-screen-service-text">
              <h3>Messages</h3>
              <p>Direct communication for reporting and updates.</p>
            </div>
            <div className="user-home-screen-arrow">
              <ArrowIcon />
            </div>
          </div>

          {/* SERVICE 4: USER PROFILE */}
          <div className="user-home-screen-service-box" onClick={() => navigate('/profile')}>
            <div className="user-home-screen-icon-circle">
              <UserIcon />
            </div>
            <div className="user-home-screen-service-text">
              <h3>User Profile</h3>
              <p>Edit your personal details so we would know you better.</p>
            </div>
            <div className="user-home-screen-arrow">
              <ArrowIcon />
            </div>
          </div>
        </div>

        {/* ABOUT US SECTION */}
        <div className="user-home-screen-about-section">
          <div className="user-home-screen-about-header">
            <h2 className="user-home-screen-header">About us</h2>
            <div className="user-home-screen-header-line"></div>
          </div>
          <p className="user-home-screen-about-text">
            FireWatch is committed to improving public safety through proactive fire prevention tools, 
            timely alerts, and direct engagement. Our mission is to provide all citizens with the tools
            and knowledge necessary to build a safer and more fire-resilient community for everyone.
          </p>
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <UserNavBar />
    </div>
  );
}