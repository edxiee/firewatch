import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import UserNavBar from "./UserNavBar"; 
import "./EmergencyScreen.css"; 

export default function EmergencyScreen() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  
  // LIVE LOCATION STATES
  const [userCoords, setUserCoords] = useState({ lat: 14.628, lng: 121.051 }); // Default fallback (e.g., Manila)
  const [locationReady, setLocationReady] = useState(false);

  // 1. Live Tracking: Watch the user's position as they move
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationReady(true);
      },
      (err) => {
        console.error("GPS Watch Error:", err);
        setLocationReady(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Cleanup: Stop tracking when the user leaves the screen
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. Construct dynamic OpenStreetMap URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${userCoords.lng - 0.005}%2C${userCoords.lat - 0.005}%2C${userCoords.lng + 0.005}%2C${userCoords.lat + 0.005}&layer=mapnik&marker=${userCoords.lat}%2C${userCoords.lng}`;

  const handleEmergency = async () => {
    if (isSending) return;

    if (window.confirm("WARNING: Are you sure you want to report a FIRE? This will alert authorities immediately.")) {
      setIsSending(true);

      try {
        const user = auth.currentUser;
        
        // Prevent sending if GPS isn't locked yet
        if (!locationReady) {
          throw new Error("LOCATION_NOT_READY");
        }

        // 3. Add document using the live coordinates from state
        await addDoc(collection(db, "emergencies"), {
          userId: user ? user.uid : "Anonymous",
          userEmail: user ? user.email : "No Email",
          type: "FIRE ALERT",
          status: "active",
          timestamp: serverTimestamp(),
          latitude: userCoords.lat,
          longitude: userCoords.lng,
        });

        alert("EMERGENCY ALERT SENT! Help is being notified. Please stay safe.");
        
      } catch (error) {
        console.error("Emergency Error:", error);
        
        if (error.message === "LOCATION_NOT_READY") {
          alert("Wait! We are still getting your GPS signal. Please try again in a few seconds.");
        } else if (error.code === 1) { 
          alert("CRITICAL: Location access denied. Please enable GPS in your browser settings so help can find you.");
        } else {
          alert("Failed to send alert. Please call emergency services directly.");
        }
      } finally {
        // Re-enable button after 10-second cooldown to prevent spam
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
        {/* Pulsing Status Text */}
        <div className="location-title">
          {locationReady ? (
            <span className="gps-active">📍 GPS Signal Active</span>
          ) : (
            <span className="searching-gps">📡 Searching for GPS signal...</span>
          )}
        </div>

        {/* Live Dynamic Map */}
        <div className="map-frame">
          <iframe
            className="map-iframe"
            title="live-map"
            loading="lazy"
            src={mapUrl}
          />
        </div>

        <div className="emergency-title">Tap For Fire Emergency</div>

        {/* HELP! Button with status check */}
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