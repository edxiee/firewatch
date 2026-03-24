import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import AdminNavbar from "./AdminNavbar.jsx";
import "./AdminNotifications.css";

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState([]);

  // 1. Listen for incoming emergencies from users
  useEffect(() => {
  const q = query(collection(db, "emergencies"), orderBy("timestamp", "desc"));
  
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    // --- ALARM SOUND LOGIC ---
    snapshot.docChanges().forEach((change) => {
      // Only play sound if a NEW document is added and it's 'active'
      if (change.type === "added" && change.doc.data().status === "active") {
        playAlarm();
      }
    });
    // -------------------------

    const alertPromises = snapshot.docs.map(async (alertDoc) => {
      const data = alertDoc.data();
      let fullName = "Loading...";
      if (data.userId && data.userId !== "Anonymous") {
        const userSnap = await getDoc(doc(db, "users", data.userId));
        if (userSnap.exists()) {
          const u = userSnap.data();
          fullName = `${u.firstName} ${u.lastName}`;
        }
      } else {
        fullName = "Anonymous User";
      }
      return { id: alertDoc.id, ...data, fullName };
    });

    const resolvedAlerts = await Promise.all(alertPromises);
    setAlerts(resolvedAlerts);
  });

  return () => unsubscribe();
}, []);

// Helper function to play the sound
const playAlarm = () => {
  const alarm = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-emergency-alert-alarm-1007.mp3");
  alarm.volume = 0.5; // Set volume to 50%
  alarm.play().catch(e => console.log("Audio playback blocked until user interacts with the page."));
};

  // 2. Function for your Broadcast button
  const handleBroadcast = async () => {
    const message = window.prompt("Enter the emergency message for all users:");
    if (!message) return;

    try {
      await addDoc(collection(db, "broadcasts"), {
        message: message,
        sender: "Admin",
        timestamp: serverTimestamp(),
      });
      alert("Broadcast sent to all users!");
    } catch (e) {
      alert("Error sending broadcast.");
    }
  };

  const markAsResolved = async (id) => {
    await updateDoc(doc(db, "emergencies", id), { status: "resolved" });
  };

  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">Broadcast & Alerts</div>
      </div>

      <div className="content">
        {/* Your Original Broadcast Section */}
        <div className="welcome-section">
          <h2 className="services-header">Push Notifications</h2>
          <div className="header-line"></div>
          <p className="services-subtitle">Send emergency alerts to all users.</p>
          <button className="submit-btn" style={{marginTop: "10px"}} onClick={handleBroadcast}>
            Send Fire Alert Broadcast
          </button>
        </div>

        <hr style={{margin: "20px 0", opacity: 0.2}} />

        {/* Incoming Emergency Feed */}
        <div className="welcome-section">
          <h2 className="services-header">Active Emergencies</h2>
          <p className="services-subtitle">Real-time reports from users.</p>
        </div>

        <div className="alerts-container">
          {alerts.length === 0 ? (
            <p className="no-alerts">No emergency alerts reported.</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`alert-card ${alert.status}`}>
                <div className="alert-header">
                  <span className="alert-type">🔥 {alert.type}</span>
                  <span className="alert-time">
                    {alert.timestamp?.toDate().toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="alert-body">
                  <p><strong>Reporter:</strong> {alert.fullName}</p>
                  <p><strong>Location:</strong> {alert.latitude}, {alert.longitude}</p>
                  
                  {alert.latitude && alert.latitude !== "Permission Denied" && (
                    <a 
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="map-link"
                    >
                      📍 View on Google Maps
                    </a>
                  )}
                </div>

                {alert.status === "active" && (
                  <button className="resolve-btn" onClick={() => markAsResolved(alert.id)}>
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}