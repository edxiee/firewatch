import React, { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../services/firebase.js";
import UserNavBar from "../../components/navigation/UserNavBar.jsx";
import "./Notification.css";


/* =========================================
   SVG ICONS
   ========================================= */

const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const FireIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4.5-8.5.2 2-1 3.5-2.5 4.5.2-3-1.2-6-4-9-1 4-4 6.5-4 11 0 5 3.5 9 8 9z" />
  </svg>
);

const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 17h4V5H2v12h3" />
    <path d="M14 9h4l4 4v4h-3" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="16.5" cy="17.5" r="2.5" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </svg>
);


/* =========================================
   HELPERS
   ========================================= */

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  try {
    const date =
      typeof timestamp.toDate === "function"
        ? timestamp.toDate()
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
};


/* =========================================
   NOTIFICATION SCREEN
   ========================================= */

export default function Notification() {
  const [latestEmergency, setLatestEmergency] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listenerError, setListenerError] = useState("");


  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setIsLoading(false);
      return undefined;
    }

    const emergencyQuery = query(
      collection(db, "emergencies"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      emergencyQuery,

      (snapshot) => {
        if (!snapshot.empty) {
          const document = snapshot.docs[0];

          setLatestEmergency({
            id: document.id,
            ...document.data(),
          });
        } else {
          setLatestEmergency(null);
        }

        setListenerError("");
        setIsLoading(false);
      },

      (error) => {
        console.error("[FireWatch] Notification listener error:", error);

        setListenerError(
          "We could not load your latest emergency status. Please try again."
        );

        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);


  const timestampText = formatTimestamp(latestEmergency?.timestamp);


  const renderNotification = () => {
    if (isLoading) {
      return (
        <div className="user-notification-state-card" aria-live="polite">
          <div className="user-notification-state-icon">
            <BellIcon />
          </div>

          <h2>Loading notifications</h2>

          <p>Checking your latest emergency status...</p>
        </div>
      );
    }

    if (listenerError) {
      return (
        <div className="user-notification-state-card user-notification-state-error">
          <div className="user-notification-state-icon">
            <InfoIcon />
          </div>

          <h2>Unable to load notifications</h2>

          <p>{listenerError}</p>
        </div>
      );
    }

    if (!latestEmergency) {
      return (
        <div className="user-notification-state-card">
          <div className="user-notification-state-icon">
            <BellIcon />
          </div>

          <h2>No notifications yet</h2>

          <p>
            Updates about your emergency reports will appear here.
          </p>
        </div>
      );
    }

    if (latestEmergency.status === "responding") {
      return (
        <article className="user-notification-card is-responding">
          <div className="user-notification-card-icon">
            <TruckIcon />
          </div>

          <div className="user-notification-card-content">
            <div className="user-notification-card-heading">
              <div>
                <span className="user-notification-status-label">
                  Responding
                </span>

                <h2>Response in Progress</h2>
              </div>

              {timestampText && (
                <time className="user-notification-time">
                  {timestampText}
                </time>
              )}
            </div>

            <p>
              Fire personnel have responded to your help request.
            </p>
          </div>
        </article>
      );
    }

    if (latestEmergency.status === "resolved") {
      return (
        <article className="user-notification-card is-resolved">
          <div className="user-notification-card-icon">
            <CheckIcon />
          </div>

          <div className="user-notification-card-content">
            <div className="user-notification-card-heading">
              <div>
                <span className="user-notification-status-label">
                  Resolved
                </span>

                <h2>Alert Resolved</h2>
              </div>

              {timestampText && (
                <time className="user-notification-time">
                  {timestampText}
                </time>
              )}
            </div>

            <p>
              Your emergency help request has been resolved.
            </p>
          </div>
        </article>
      );
    }

    return (
      <article className="user-notification-card is-active">
        <div className="user-notification-card-icon">
          <FireIcon />
        </div>

        <div className="user-notification-card-content">
          <div className="user-notification-card-heading">
            <div>
              <span className="user-notification-status-label">
                Active
              </span>

              <h2>Emergency Reported</h2>
            </div>

            {timestampText && (
              <time className="user-notification-time">
                {timestampText}
              </time>
            )}
          </div>

          <p>
            Your request is active. Waiting for fire personnel to respond.
          </p>
        </div>
      </article>
    );
  };


  return (
    <div className="user-notification-screen">

      <header className="user-notification-top-bar">
        <img
          className="user-notification-logo"
          src="/Logo.png"
          alt="FireWatch Logo"
        />

        <div className="user-notification-title">
          Notifications
        </div>
      </header>


      <main className="user-notification-content">

        <section className="user-notification-heading">
          <h1>Emergency Updates</h1>

          <p>
            Track the latest status of your FireWatch emergency report.
          </p>
        </section>


        <section
          className="user-notification-list"
          aria-label="Emergency notifications"
        >
          {renderNotification()}
        </section>

      </main>


      <UserNavBar />
    </div>
  );
}
