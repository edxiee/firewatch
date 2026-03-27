import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; 
import { onAuthStateChanged, reload, signOut } from "firebase/auth";

import LandingPage from "./LandingPage.jsx";
import Auth from "./auth/Auth.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import PersonalDetails from "./pages/PersonalDetails.jsx";
import EmergencyScreen from "./pages/EmergencyScreen.jsx";
import Notification from "./pages/Notification.jsx"; 
import Message from "./pages/Message.jsx"; 

// ADMIN IMPORTS
import AdminScreen from "./admin/AdminScreen.jsx"; 
import AdminProfile from "./admin/AdminProfile.jsx"; 
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
          // Force refresh to check if user still exists in Firebase Auth
          await reload(user);
          
          // --- REMOVED EMAIL VERIFICATION CHECK FROM HERE ---
          
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
      /* Changed from class to id to match your CSS #splash-screen */
      <div id="splash-screen">
        <div className="splash-content">
          <img src="/Logo.png" alt="FireWatch Logo" className="splash-logo" />
        </div>
        
        {/* Added the footer area for the spinner and text */}
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
      <Route path="/admin" element={<ProtectedRoute><AdminScreen /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} /> 
      <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
      <Route path="/admin/create-account" element={<ProtectedRoute><CreateAdmin /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      <Route path="/home" element={<HomeScreen />}/>
      <Route path="/emergency" element={<EmergencyScreen />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/message" element={<Message />} />
      <Route path="/profile" element={<PersonalDetails />} />
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