import React from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Import your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import UserNavBar from "./UserNavBar"; 
import "./EmergencyScreen.css"; 

export default function EmergencyScreen() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = React.useState(false);

  const handleEmergency = async () => {
    if (isSending) return;

    if (window.confirm("WARNING: Are you sure you want to report a FIRE? This will alert emergency services immediately.")) {
      setIsSending(true);

      try {
        const user = auth.currentUser;
        
        // 1. Get User's Location (Optional but highly recommended)
        let coords = { lat: null, lng: null };
        
        const getPosition = () => {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => resolve({ lat: "Permission Denied", lng: "Permission Denied" }),
              { timeout: 5000 }
            );
          });
        };

        const locationData = await getPosition();

        // 2. Add document to 'emergencies' collection
        await addDoc(collection(db, "emergencies"), {
          userId: user ? user.uid : "Anonymous",
          userEmail: user ? user.email : "No Email",
          type: "FIRE ALERT",
          status: "active", // Admin can change this to 'resolved' later
          timestamp: serverTimestamp(),
          latitude: locationData.lat,
          longitude: locationData.lng,
        });

        alert("EMERGENCY ALERT SENT! Help is being notified. Please stay safe.");
        
      } catch (error) {
        console.error("Error sending emergency:", error);
        alert("Failed to send alert. Please call emergency services directly.");
      } finally {
        // Re-enable button after 10 seconds to prevent spamming
        setTimeout(() => setIsSending(false), 10000);
      }
    }
  };

  return (
    <div className="homescreen">
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Emergency Center</div>
      </div>

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

        {/* Added a 'loading' style check to the button */}
        <button 
          className={`emergency-circle ${isSending ? "disabled-btn" : ""}`} 
          onClick={handleEmergency} 
          type="button"
          disabled={isSending}
        >
          <div className="inner-glow">
            <span className="signal-waves">(((</span>
            <span className="help-text">{isSending ? "SENDING..." : "HELP!"}</span>
            <span className="signal-waves">)))</span>
          </div>
        </button>
      </div>

      <UserNavBar />
    </div>
  );
}