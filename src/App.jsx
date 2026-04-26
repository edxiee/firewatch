import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; 
import { onAuthStateChanged, reload, signOut } from "firebase/auth";

import LandingPage from "./LandingPage.jsx";
import Auth from "./auth/Auth.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import PersonalDetails from "./pages/PersonalDetails.jsx";
import UserEditProfile from "./pages/UserEditProfile.jsx"; // IMPORT THE USER VERSION
import EmergencyScreen from "./pages/EmergencyScreen.jsx";
import Notification from "./pages/Notification.jsx"; 
import Message from "./pages/Message.jsx"; 

// ADMIN IMPORTS
import AdminScreen from "./admin/AdminScreen.jsx"; 
import AdminProfile from "./admin/AdminProfile.jsx"; 
import EditProfile from "./admin/EditProfile.jsx"; // THIS IS THE ADMIN VERSION
import AdminMessages from "./admin/AdminMessages.jsx"; 
import AdminNotifications from "./admin/AdminNotifications.jsx"; 
import CreateAdmin from "./admin/CreateAdmin.jsx"; 
import UserList from "./admin/UserList.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

function AppRoutes() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await reload(user);
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            alert("This account has been deleted from our records.");
            await signOut(auth);
            navigate("/");
          }
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div id="splash-screen">
        <div className="splash-content">
          <img src="/Logo.png" alt="FireWatch Logo" className="splash-logo" />
        </div>
        <div className="splash-footer">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Auth />} /> 
      <Route path="/landing" element={<LandingPage />} />
      
      {/* --- ADMIN ROUTES (Requires Login + Admin Role) --- */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminScreen /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute adminOnly><AdminProfile /></ProtectedRoute>} />
      <Route path="/admin/edit-profile" element={<ProtectedRoute adminOnly><EditProfile /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} /> 
      <Route path="/admin/notifications" element={<ProtectedRoute adminOnly><AdminNotifications /></ProtectedRoute>} />
      <Route path="/admin/create-account" element={<ProtectedRoute adminOnly><CreateAdmin /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><UserList /></ProtectedRoute>} />
      
      {/* --- USER ROUTES (Requires Login) --- */}
      <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>}/>
      <Route path="/emergency" element={<ProtectedRoute><EmergencyScreen /></ProtectedRoute>} />
      <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
      <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><PersonalDetails /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><UserEditProfile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default App;