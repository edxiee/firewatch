import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="homescreen">
      <div className="bg-glow"></div>
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">FireWatch</div>
      </div>

      <div className="content">
        <div className="services-container">
          <div className="welcome-section">
            <h2 className="services-header">Our Services</h2>
            <div className="header-line"></div>
            <p className="services-subtitle">Your safety is our priority. Explore how FireWatch helps you.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-box" onClick={() => navigate("/emergency")}>
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" className="service-icon"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 3.03-3.08 7.37-5 9.77C10.08 16.37 7 12.03 7 9z"/><path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>
              </div>
              <div className="service-text">
                <h3>FIRE PREVENTION</h3>
                <p>Safety tips and emergency preparedness guides.</p>
              </div>
              <div className="arrow-link">→</div>
            </div>

            <div className="service-box" onClick={() => navigate("/notification")}>
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" className="service-icon"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15h-2v-2h2v2zm0-4h-2V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
              </div>
              <div className="service-text">
                <h3>Notification</h3>
                <p>Allow our notification features to keep you informed.</p>
              </div>
              <div className="arrow-link">→</div>
            </div>

            <div className="service-box" onClick={() => navigate("/profile")}>
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" className="service-icon"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2.42l1.83-1.83 1.42 1.41L6 14zm3.83-3.83l6.59-6.59 1.41 1.41-6.59 6.59-1.41-1.41z"/></svg>
              </div>
              <div className="service-text">
                <h3>User Profile</h3>
                <p>Edit your personal details so we would know you better.</p>
              </div>
              <div className="arrow-link">→</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <button className="nav-btn active" onClick={() => navigate("/home")}><svg viewBox="0 0 24 24" className="nav-icon"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg></button>
        <button className="nav-btn" onClick={() => navigate("/emergency")}><svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg></button>
        <button className="nav-btn" onClick={() => navigate("/message")}><svg viewBox="0 0 24 24" className="nav-icon"><path d="M4 4h16v12H5.17L4 17.17V4z" /></svg></button>
        <button className="nav-btn" onClick={() => navigate("/notification")}><svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" /></svg></button>
        <button className="nav-btn" onClick={() => navigate("/profile")}><svg viewBox="0 0 24 24" className="nav-icon"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg></button>
      </div>
    </div>
  );
}