import React from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "./UserNavBar"; // Import the shared navigation bar
import "./EmergencyScreen.css"; 

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

      {/* REPLACED: Manual bottom-bar replaced with UserNavBar */}
      <UserNavBar />
    </div>
  );
}