import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar.jsx";
import "./AdminProfile.css";

export default function AdminProfile() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAdminData(docSnap.data());
        }
      }
    };
    fetchAdminData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="profile-wrapper">
      <div className="admin-top-bar">
        <div className="top-title">PROFILE</div>
      </div>

      <div className="content-scrollable">
        <div className="profile-header-red">
          <div className="profile-main">
            <div className="avatar-container">
              <div className="avatar-img">
                {adminData?.profileImage ? (
                  <img src={adminData.profileImage} alt="Profile" className="profile-pic-img" />
                ) : (
                  /* Using .slice(0, 1) ensures ONLY the first letter appears */
                  adminData?.firstName?.trim().slice(0, 1).toUpperCase() || "A"
                )}
              </div>
            </div>
            
            <h2 className="profile-name">{adminData?.firstName || "Admin Name"}</h2>
            <p className="profile-email">{user?.email}</p>
            
            <button className="edit-profile-btn" onClick={() => navigate("/admin/edit-profile")}>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-body-light">
          <div className="menu-list">
            {/* REGISTER ADMIN ICON (KEY) */}
            {/* REGISTER ADMIN ICON (PLUS SIGN) */}
            <div className="menu-item-compact" onClick={() => navigate("/admin/create-account")}>
              <div className="menu-icon-small yellow-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <div className="menu-text-compact">
                <p className="menu-title-small">Register Admin</p>
              </div>
              <div className="arrow-small">›</div>
            </div>

            {/* USER MANAGEMENT ICON (USERS) */}
            <div className="menu-item-compact" onClick={() => navigate("/admin/users")}>
              <div className="menu-icon-small purple-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="menu-text-compact"><p className="menu-title-small">User Management</p></div>
              <div className="arrow-small">›</div>
            </div>

            {/* LOGOUT ICON (LOG OUT) */}
            <div className="menu-item-compact logout" onClick={handleLogout}>
              <div className="menu-icon-small red-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div className="menu-text-compact"><p className="menu-title-small red-text">Logout</p></div>
            </div>
          </div>
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}