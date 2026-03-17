import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Ensure path is correct
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./PersonalDetails.css"; 

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    // 1. Check if a user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 2. Reference the specific user document in Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
              phone: data.contact || "",
              email: data.email || user.email,
              address: data.address || "",
            });
          } else {
            console.log("No such user document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in, redirect to login
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        // Note: This only updates the Firestore fields, not the Auth Email
        await updateDoc(docRef, {
          contact: formData.phone,
          address: formData.address,
          // If you want to split fullName back to first/last, logic would go here
        });
        alert("Details Updated!");
      }
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); 
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  if (loading) {
    return <div className="homescreen" style={{justifyContent: 'center', color: 'white'}}>Loading Profile...</div>;
  }

  return (
    <div className="homescreen">
      {/* TOP BAR */}
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Profile</div>
      </div>

      {/* CONTENT */}
      <div className="content">
        <div className="location-title">Personal Details</div>

        <div style={{ width: "100%", maxWidth: "360px", marginTop: "20px" }}>
          <div className="input-group">
            <label>FULL NAME</label>
            <input
              name="fullName"
              className="profile-input"
              value={formData.fullName}
              onChange={handleChange}
              disabled // Keep disabled if you don't want them changing names easily
            />
          </div>

          <div className="input-group">
            <label>PHONE</label>
            <input
              name="phone"
              className="profile-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>EMAIL</label>
            <input
              name="email"
              className="profile-input"
              value={formData.email}
              disabled // Email should usually be changed via Auth methods
            />
          </div>

          <div className="input-group">
            <label>ADDRESS</label>
            <input
              name="address"
              className="profile-input"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button
            className="profile-save-btn"
            onClick={handleUpdate}
          >
            SAVE CHANGES
          </button>

          <button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            LOG OUT
          </button>
        </div>
      </div>

      {/* BOTTOM BAR (Same as before) */}
      <div className="bottom-bar">
        {/* ... Nav Buttons ... */}
        <button className="nav-btn" onClick={() => navigate("/home")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
        </button>
        <button className="nav-btn" onClick={() => navigate("/emergency")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
        </button>
        <button className="nav-btn" onClick={() => navigate("/message")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M4 4h16v12H5.17L4 17.17V4z" /></svg>
        </button>
        <button className="nav-btn" onClick={() => navigate("/notification")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" /></svg>
        </button>
        <button className="nav-btn active" onClick={() => navigate("/profile")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
        </button>
      </div>
    </div>
  );
}