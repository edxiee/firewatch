import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonalDetails.css"; // reuse SAME css

export default function PersonalDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "Arfred Salonga",
    phone: "09123456789",
    email: "arfredsalonga@gmail.com",
    address: "3b Kalayaan St. Ampid 1 QC",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            <label>Full Name</label>
            <input
              name="fullName"
              className="profile-input"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              name="phone"
              className="profile-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              className="profile-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              name="address"
              className="profile-input"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button
            className="emergency-circle"
            style={{ width: "100%", height: "50px", borderRadius: "12px", marginTop: "20px" }}
            onClick={() => alert("Details Updated!")}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>

      <div className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate("/home")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
        </button>

        <button className="nav-btn" onClick={() => navigate("/emergency")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
        </button>

        {/* Added navigate here */}
        <button className="nav-btn" onClick={() => navigate("/message")}>
          <svg viewBox="0 0 24 24" className="nav-icon"><path d="M4 4h16v12H5.17L4 17.17V4z" /></svg>
        </button>

        {/* Added navigate here */}
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