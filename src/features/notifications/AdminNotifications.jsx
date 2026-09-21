import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import AdminNavbar from "../../components/navigation/AdminNavBar.jsx";
import "./AdminNotifications.css";

// --- SVG ICONS ---
const FireIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState([]);

  const playAlarm = () => {
    const alarm = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-emergency-alert-alarm-1007.mp3");
    alarm.volume = 0.5;
    alarm.play().catch(() => console.log("Audio waiting for user interaction."));
  };

  useEffect(() => {
    const q = query(collection(db, "emergencies"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && change.doc.data().status === "active") {
          playAlarm();
        }
      });

      const alertPromises = snapshot.docs.map(async (alertDoc) => {
        const data = alertDoc.data();
        let fullName = "Loading...";
        
        if (data.userId && data.userId !== "Anonymous") {
          try {
            const userSnap = await getDoc(doc(db, "users", data.userId));
            if (userSnap.exists()) {
              const u = userSnap.data();
              fullName = `${u.firstName} ${u.lastName}`;
            } else {
              fullName = "Unknown User";
            }
          } catch {
            fullName = "Error loading name";
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

  const respondToEmergency = async (id) => {
    try {
      const alertRef = doc(db, "emergencies", id);
      await updateDoc(alertRef, {
        status: "responding",
        respondedAt: serverTimestamp()
      });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const markAsResolved = async (id) => {
    try {
      const alertRef = doc(db, "emergencies", id);
      await updateDoc(alertRef, {
        status: "resolved",
        resolvedAt: serverTimestamp()
      });
      alert("Emergency marked as resolved.");
    } catch {
      alert("Permission Denied: Check your Firestore rules.");
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    try {
      return timestamp.toDate().toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="admin-notifications">
      {/* TOP BAR - Matches Dashboard exactly */}
      <div className="admin-notifications-top-bar">
        <img className="admin-notifications-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="admin-notifications-title">Notifications</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-notifications-content">
        <div className="admin-notifications-header">
          <h2 className="admin-notifications-heading">Emergency Reports</h2>
          <div className="admin-notifications-header-line"></div>
          <p className="admin-notifications-subheading">Real-time reports from users.</p>
        </div>

        <div className="admin-notifications-list">
          {alerts.length === 0 ? (
            <div className="admin-notifications-empty">
              <CheckIcon />
              <p>No emergency alerts reported.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`admin-notifications-card status-${alert.status}`}>
                
                {/* Card Header */}
                <div className="admin-notifications-card-header">
                  <div className="admin-notifications-card-type">
                    <FireIcon />
                    <span>{alert.type || "Fire Emergency"}</span>
                  </div>
                  <div className="admin-notifications-card-time">
                    <ClockIcon />
                    <span>{formatTimestamp(alert.timestamp)}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="admin-notifications-card-body">
                  <div className="admin-notifications-info-row">
                    <UserIcon />
                    <span className="admin-notifications-info-label">Reporter:</span>
                    <span className="admin-notifications-info-value">{alert.fullName}</span>
                  </div>
                  
                  <div className="admin-notifications-info-row">
                    <span className="admin-notifications-info-label">Status:</span>
                    <span className={`admin-notifications-status-badge status-${alert.status}`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>

                  {alert.latitude && alert.longitude && (
                    <a 
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="admin-notifications-map-link"
                    >
                      <MapPinIcon />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>

                {/* Card Actions */}
                <div className="admin-notifications-card-actions">
                  {alert.status === "active" && (
                    <button className="admin-notifications-btn btn-respond" onClick={() => respondToEmergency(alert.id)}>
                      Respond Now
                    </button>
                  )}
                  
                  {alert.status === "responding" && (
                    <button className="admin-notifications-btn btn-resolve" onClick={() => markAsResolved(alert.id)}>
                      Mark as Resolved
                    </button>
                  )}
                  
                  {alert.status === "resolved" && (
                    <div className="admin-notifications-resolved-badge">
                      <CheckIcon />
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <AdminNavbar />
    </div>
  );
}