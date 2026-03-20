import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UserNavBar from "./UserNavBar"; // Import the shared component
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
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
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
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
        await updateDoc(docRef, {
          contact: formData.phone,
          address: formData.address,
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
    return (
      <div className="homescreen" style={{justifyContent: 'center', alignItems: 'center', background: '#ffffff'}}>
        <div style={{color: '#a31224', fontWeight: 'bold'}}>Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="homescreen">
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Profile</div>
      </div>

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
              disabled 
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
              disabled 
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

          <button className="profile-save-btn" onClick={handleUpdate}>
            SAVE CHANGES
          </button>

          <button className="profile-logout-btn" onClick={handleLogout}>
            LOG OUT
          </button>
        </div>
      </div>

      {/* Shared Uniform Navbar */}
      <UserNavBar />
    </div>
  );
}