import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../../../services/firebase.js";
import AdminNavbar from "../../../components/navigation/AdminNavBar.jsx";

import "./CreateAdmin.css";

/* =========================
   ICONS
   ========================= */

const BackIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* =========================
   CREATE ADMIN
   ========================= */

export default function CreateAdmin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in as an administrator.");
        return;
      }

      /* Verify that the current user is an admin */
      const adminDoc = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      if (
        !adminDoc.exists() ||
        adminDoc.data().role !== "admin"
      ) {
        alert(
          "Unauthorized: You do not have permission to create admin."
        );
        return;
      }

      /* Create new Firebase Authentication account */
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const newUser = userCredential.user;

      /* Save new administrator profile in Firestore */
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
      console.error(
        "[FireWatch] Create admin error:",
        error
      );

      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-admin">

      {/* =========================
          TOP BAR
          ========================= */}
      <header className="admin-create-admin-top-bar">

        <button
          type="button"
          className="admin-create-admin-back-btn"
          onClick={() => navigate("/admin")}
          aria-label="Back to Admin Dashboard"
          title="Back to Dashboard"
        >
          <BackIcon />
        </button>

        <img
          className="admin-create-admin-logo"
          src="/Logo.png"
          alt="FireWatch Logo"
        />

        <div className="admin-create-admin-title">
          Create Admin
        </div>

      </header>

      {/* =========================
          MAIN CONTENT
          ========================= */}
      <main className="admin-create-admin-content">

        <div className="admin-create-admin-form-card">

          <div className="admin-create-admin-form-header">

            <ShieldIcon />

            <h2>New Admin Account</h2>

            <p>
              Enter the details for the new administrator.
            </p>

          </div>

          <form
            className="admin-create-admin-form"
            onSubmit={handleCreateAdmin}
          >

            {/* ADMIN NAME */}
            <div className="admin-create-admin-input-group">

              <label
                className="admin-create-admin-label"
                htmlFor="admin-name"
              >
                Admin Full Name
              </label>

              <input
                id="admin-name"
                className="admin-create-admin-input"
                type="text"
                placeholder="e.g. Officer Juan"
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>

            {/* ADMIN EMAIL */}
            <div className="admin-create-admin-input-group">

              <label
                className="admin-create-admin-label"
                htmlFor="admin-email"
              >
                Admin Email
              </label>

              <input
                id="admin-email"
                className="admin-create-admin-input"
                type="email"
                placeholder="admin@firewatch.com"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            {/* TEMPORARY PASSWORD */}
            <div className="admin-create-admin-input-group">

              <label
                className="admin-create-admin-label"
                htmlFor="admin-password"
              >
                Temporary Password
              </label>

              <input
                id="admin-password"
                className="admin-create-admin-input"
                type="password"
                placeholder="Min 6 characters"
                minLength={6}
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="admin-create-admin-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Confirm Registration"}
            </button>

          </form>

        </div>

      </main>

      {/* =========================
          ADMIN NAVIGATION
          ========================= */}
      <AdminNavbar />

    </div>
  );
}