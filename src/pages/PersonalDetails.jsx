import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UserNavBar from "./UserNavBar"; 
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

  // Replace your existing useEffect inside PersonalDetails.jsx with this:

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // DEBUG: Uncomment the line below to see exactly what is in your database in the F12 console
          // console.log("Database Data:", data);

          setFormData({
            // Check for firstName/lastName OR a combined fullName field
            fullName: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "User",
            
            // Check for 'contact' OR 'phone' OR 'phoneNumber'
            phone: data.contact || data.phone || data.phoneNumber || "",
            
            email: data.email || user.email,
            address: data.address || "",
          });
        } else {
          // If no document exists yet, at least show the email
          setFormData(prev => ({ ...prev, email: user.email }));
          console.warn("No Firestore document found for this UID!");
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
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          contact: formData.phone, // Saving as 'contact' to match your Auth logic
          address: formData.address,
        });
        alert("Details Updated Successfully!");
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
      <div className="homescreen splash-screen" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ffffff', height: '100vh'}}>
        <div style={{color: '#a31224', fontWeight: 'bold', textAlign: 'center'}}>
          <img src="/Logo.png" alt="Loading..." style={{width: '80px', marginBottom: '10px'}} /><br/>
          Loading Profile...
        </div>
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

        <div className="profile-form-container" style={{ width: "100%", maxWidth: "360px", marginTop: "20px" }}>
          <div className="input-group">
            <label>FULL NAME</label>
            <input
              type="text"
              name="fullName"
              className="profile-input"
              value={formData.fullName}
              disabled 
            />
          </div>

          <div className="input-group">
            <label>PHONE</label>
            <input
              type="text"
              name="phone"
              className="profile-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Add phone number"
            />
          </div>

          <div className="input-group">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              className="profile-input"
              value={formData.email}
              disabled 
            />
          </div>

          <div className="input-group">
            <label>ADDRESS</label>
            <input
              type="text"
              name="address"
              className="profile-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Add home address"
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

      <UserNavBar />
    </div>
  );
}