import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar.jsx";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper function to "hash"/mask sensitive data for the UI
  const maskData = (str) => {
    if (!str) return "";
    if (str.includes("@")) { // Email masking
      const [first, last] = str.split("@");
      return first.substring(0, 2) + "******@" + last;
    }
    return str.substring(0, 2) + "******"; // Name masking
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.firstName || "Admin");
          setPhone(data.contactNumber || "");
          setAddress(data.address || "");
          setPreviewUrl(data.profileImage || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        contactNumber: phone,
        address: address,
        profileImage: previewUrl, 
      });
      alert("Profile updated successfully!");
      navigate("/admin/profile");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-wrapper">
      <div className="admin-top-bar">
        <button onClick={() => navigate(-1)} className="back-btn">←</button>
        <div className="top-title">Edit Profile</div>
      </div>

      <div className="content-scrollable">
        <div className="edit-header-dark">
          <div className="avatar-container-large">
            <div className="avatar-img-large">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="profile-img-preview" />
              ) : (
                name.charAt(0).toUpperCase() || "A"
              )}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} 
              onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
            <button type="button" className="change-photo-btn" onClick={() => fileInputRef.current.click()}>📸</button>
          </div>
        </div>

        <div className="edit-body">
          <form onSubmit={handleUpdate} className="edit-form">
            {/* HASHED / READ-ONLY FIELDS */}
            <div className="input-field-group">
              <label className="input-label">Full Name (Protected)</label>
              <input type="text" className="edit-input disabled" value={maskData(name)} disabled />
            </div>

            <div className="input-field-group">
              <label className="input-label">Email Address (Protected)</label>
              <input type="text" className="edit-input disabled" value={maskData(user?.email)} disabled />
            </div>

            {/* EDITABLE FIELDS */}
            <div className="input-field-group">
              <label className="input-label">Contact Number</label>
              <input 
                type="tel" 
                className="edit-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="0912 345 6789"
              />
            </div>

            <div className="input-field-group">
              <label className="input-label">Office Address</label>
              <textarea 
                className="edit-input text-area" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Enter complete office address"
                rows="3"
              />
            </div>

            <button type="submit" className="save-changes-btn" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}