import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../services/firebase.js";
import UserNavBar from "../../components/navigation/UserNavBar.jsx";
import "./EmergencyScreen.css";

/* =========================================
   SVG ICONS
   ========================================= */

const MapPinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SignalIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 20h.01" />
    <path d="M7 20v-4" />
    <path d="M12 20v-8" />
    <path d="M17 20V8" />
    <path d="M22 4v16" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);


/* =========================================
   EMERGENCY SCREEN
   ========================================= */

export default function EmergencyScreen() {
  const [isSending, setIsSending] = useState(false);

  /*
    Important:
    Do not use a fake/default coordinate.
    The map and emergency submission only use
    coordinates returned by the device GPS.
  */
  const [userCoords, setUserCoords] = useState(null);
  const [locationReady, setLocationReady] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationError, setLocationError] = useState("");


  /* =========================================
     LIVE LOCATION TRACKING
     ========================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationReady(false);
      return undefined;
    }

    setLocationError("");

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setLocationAccuracy(
          Number.isFinite(position.coords.accuracy)
            ? Math.round(position.coords.accuracy)
            : null
        );

        setLocationReady(true);
        setLocationError("");
      },

      (error) => {
        console.error("GPS Watch Error:", error);

        setLocationReady(false);
        setUserCoords(null);
        setLocationAccuracy(null);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission is blocked. Allow location access to send your position."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(
            "Your location is currently unavailable. Check your GPS or network connection."
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationError(
            "Location request timed out. We are still trying to get your GPS signal."
          );
        } else {
          setLocationError(
            "Unable to get your location. Check your location settings and try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);


  /* =========================================
     MAP
     ========================================= */

  const mapUrl = userCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        userCoords.lng - 0.005
      }%2C${userCoords.lat - 0.005}%2C${
        userCoords.lng + 0.005
      }%2C${userCoords.lat + 0.005}&layer=mapnik&marker=${
        userCoords.lat
      }%2C${userCoords.lng}`
    : "";


  /* =========================================
     SEND EMERGENCY
     ========================================= */

  const handleEmergency = async () => {
    if (isSending) {
      return;
    }

    if (!locationReady || !userCoords) {
      alert(
        "Your GPS location is not ready yet. Please wait for the location signal before sending an emergency alert."
      );
      return;
    }

    const confirmed = window.confirm(
      "WARNING: Are you sure you want to report a FIRE? This will alert authorities immediately."
    );

    if (!confirmed) {
      return;
    }

    setIsSending(true);

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "emergencies"), {
        userId: user ? user.uid : "Anonymous",
        userEmail: user ? user.email : "No Email",
        type: "FIRE ALERT",
        status: "active",
        timestamp: serverTimestamp(),
        latitude: userCoords.lat,
        longitude: userCoords.lng,
      });

      alert(
        "EMERGENCY ALERT SENT! Help is being notified. Please stay safe."
      );
    } catch (error) {
      console.error("Emergency submission error:", error);

      alert(
        "Failed to send the alert. Please contact emergency services directly."
      );
    } finally {
      /*
        Keep the short cooldown from the current implementation
        so repeated emergency submissions are not sent accidentally.
      */
      setTimeout(() => {
        setIsSending(false);
      }, 10000);
    }
  };


  /* =========================================
     RENDER
     ========================================= */

  return (
    <div className="user-emergency-screen">

      <header className="user-emergency-screen-top-bar">
        <img
          className="user-emergency-screen-logo"
          src="/Logo.png"
          alt="FireWatch Logo"
        />

        <div className="user-emergency-screen-title">
          Emergency Center
        </div>
      </header>


      <main className="user-emergency-screen-content">

        <div className="user-emergency-screen-heading">
          <h1>Fire Emergency</h1>

          <p>
            Confirm your live location before sending an emergency alert.
          </p>
        </div>


        <div className="user-emergency-screen-layout">

          {/* LOCATION PANEL */}
          <section className="user-emergency-screen-card user-emergency-screen-location-card">
            <div
              className="user-emergency-screen-gps-status"
              aria-live="polite"
            >
              {locationReady ? (
                <div className="user-emergency-screen-gps-active">
                  <MapPinIcon />

                  <span>GPS Signal Active</span>
                </div>
              ) : locationError ? (
                <div className="user-emergency-screen-gps-error">
                  <AlertIcon />

                  <span>{locationError}</span>
                </div>
              ) : (
                <div className="user-emergency-screen-gps-searching">
                  <SignalIcon />

                  <span>Searching for GPS signal...</span>
                </div>
              )}
            </div>


            {locationReady && locationAccuracy !== null && (
              <p className="user-emergency-screen-accuracy">
                Estimated accuracy: approximately {locationAccuracy} meters
              </p>
            )}


            <div className="user-emergency-screen-map-container">
              {locationReady && userCoords ? (
                <iframe
                  className="user-emergency-screen-map"
                  title="Your current emergency location"
                  loading="lazy"
                  src={mapUrl}
                />
              ) : (
                <div className="user-emergency-screen-map-placeholder">
                  <MapPinIcon />

                  <strong>Waiting for your location</strong>

                  <span>
                    The map will appear after FireWatch receives your GPS position.
                  </span>
                </div>
              )}
            </div>
          </section>


          {/* EMERGENCY ACTION PANEL */}
          <section className="user-emergency-screen-card user-emergency-screen-action-card">
            <div className="user-emergency-screen-instruction">
              Tap for Fire Emergency
            </div>

            <p className="user-emergency-screen-action-description">
              Use this button only for an active fire emergency.
            </p>


            <button
              type="button"
              className={`user-emergency-screen-sos-btn ${
                isSending || !locationReady
                  ? "user-emergency-screen-sos-disabled"
                  : ""
              }`}
              onClick={handleEmergency}
              disabled={isSending || !locationReady}
              aria-label={
                isSending
                  ? "Sending fire emergency alert"
                  : "Send fire emergency alert"
              }
            >
              <span className="user-emergency-screen-sos-inner">
                <span
                  className="user-emergency-screen-signal-waves"
                  aria-hidden="true"
                >
                  (((
                </span>

                <span className="user-emergency-screen-sos-text">
                  {isSending ? "SENDING" : "HELP!"}
                </span>

                <span
                  className="user-emergency-screen-signal-waves"
                  aria-hidden="true"
                >
                  )))
                </span>
              </span>
            </button>


            {!locationReady && (
              <p className="user-emergency-screen-button-hint">
                Emergency sending will be enabled when your GPS location is ready.
              </p>
            )}

            {isSending && (
              <p
                className="user-emergency-screen-button-hint"
                aria-live="polite"
              >
                Sending your emergency alert...
              </p>
            )}
          </section>

        </div>
      </main>


      <UserNavBar />
    </div>
  );
}
