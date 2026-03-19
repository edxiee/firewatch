import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmergencyScreen.css"; // Ensure styles are linked

export default function EmergencyScreen() {
  const navigate = useNavigate();

  const [isSending, setIsSending] = React.useState(false);

  const handleEmergency = () => {
    if (isSending) return;

    if (window.confirm("Are you sure you want to tap the help button?")) {
      setIsSending(true);
      alert("Emergency Alert Sent!");
      
      // Re-enable after 5 seconds
      setTimeout(() => setIsSending(false), 5000);
    }
  };

  return (
    <div className="homescreen">
      {/* Top Bar */}
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Emergency Center</div>
      </div>

      {/* Main Content */}
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
          <div className="inner-glow">
            <span className="signal-waves">(((</span>
            <span className="help-text">HELP!</span>
            <span className="signal-waves">)))</span>
          </div>
        </button>
        
      </div>

      {/* BOTTOM BAR (Fixed logic for all buttons) */}
      <div className="bottom-bar">
        {/* Home */}
        <button className="nav-btn" type="button" onClick={() => navigate("/home")} aria-label="Home">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
          </svg>
        </button>

        {/* Emergency (Active State) */}
        <button className="nav-btn active" type="button" onClick={() => navigate("/emergency")} aria-label="Emergency">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </button>

        {/* Chat - Added navigate */}
        <button className="nav-btn" type="button" onClick={() => navigate("/message")} aria-label="Chat">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M4 4h16v12H5.17L4 17.17V4z" />
          </svg>
        </button>

        {/* Notifications - Added navigate */}
        <button className="nav-btn" type="button" onClick={() => navigate("/notification")} aria-label="Notifications">
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" />
          </svg>
        </button>

        {/* Profile */}
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