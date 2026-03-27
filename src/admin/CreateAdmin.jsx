import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./CreateAdmin.css";

export default function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Save to Firestore with 'admin' role
      await setDoc(doc(db, "users", newUser.uid), {
        firstName: name,
        lastName: "(Admin)",
        email: email,
        role: "admin",
        createdAt: new Date(),
      });

      alert("New Admin Account Created Successfully!");
      navigate("/admin/profile");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homescreen">
      <div className="admin-top-bar">
        <button onClick={() => navigate(-1)} className="back-btn">
          <span className="back-icon">←</span>
        </button>
        <div className="top-title">Register Admin</div>
      </div>

      <div className="content" style={{ padding: "20px" }}>
        <form className="auth-form" onSubmit={handleCreateAdmin}>
          <div className="input-group">
            <label>Admin Full Name</label>
            <input 
              type="text" placeholder="e.g. Officer Juan" required 
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Admin Email</label>
            <input 
              type="email" placeholder="admin@firewatch.com" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Temporary Password</label>
            <input 
              type="password" placeholder="Min 6 characters" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Confirm Registration"}
          </button>
        </form>
      </div>
      <AdminNavbar />
    </div>
  );
}