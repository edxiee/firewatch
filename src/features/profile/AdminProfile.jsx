import React, { useState, useEffect } from "react";
import { auth, db } from "../../services/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/navigation/AdminNavBar.jsx";
import "./AdminProfile.css";

// --- SVG ICONS ---
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const UserCircleIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
  </svg>
);

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
    <div className="admin-profile">
      {/* TOP BAR - Matches Dashboard & Notifications (64px height) */}
      <div className="admin-profile-top-bar">
        <img className="admin-profile-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="admin-profile-title">Profile</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-profile-content">
        
        {/* Profile Header Card */}
        <div className="admin-profile-header-card">
          <div className="admin-profile-avatar">
            {adminData?.profileImage && !adminData.profileImage.includes('blob:') && adminData.profileImage !== "Profile" ? (
              <img src={adminData.profileImage} alt="Profile" className="admin-profile-pic-img" />
            ) : (
              <UserCircleIcon />
            )}
          </div>
          <h2 className="admin-profile-name">{adminData?.firstName || "Admin Name"}</h2>
          <p className="admin-profile-email">{user?.email}</p>
          <button className="admin-profile-edit-btn" onClick={() => navigate("/admin/edit-profile")}>
            Edit Profile
          </button>
        </div>

        {/* Menu List */}
        <div className="admin-profile-menu-list">
          
          <div className="admin-profile-menu-item" onClick={() => navigate("/admin/create-account")}>
            <div className="admin-profile-icon-box yellow-bg">
              <PlusIcon />
            </div>
            <div className="admin-profile-menu-text">
              <p className="admin-profile-menu-title">Register Admin</p>
            </div>
            <div className="admin-profile-arrow">
              <ChevronIcon />
            </div>
          </div>

          <div className="admin-profile-menu-item" onClick={() => navigate("/admin/users")}>
            <div className="admin-profile-icon-box purple-bg">
              <UsersIcon />
            </div>
            <div className="admin-profile-menu-text">
              <p className="admin-profile-menu-title">User Management</p>
            </div>
            <div className="admin-profile-arrow">
              <ChevronIcon />
            </div>
          </div>

          <div className="admin-profile-menu-item logout-item" onClick={handleLogout}>
            <div className="admin-profile-icon-box red-bg">
              <LogoutIcon />
            </div>
            <div className="admin-profile-menu-text">
              <p className="admin-profile-menu-title red-text">Logout</p>
            </div>
          </div>

        </div>
      </div>
      
      <AdminNavbar />
    </div>
  );
}