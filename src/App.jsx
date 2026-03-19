import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Auth />} /> 
        <Route path="/landing" element={<LandingPage />} />
        
        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute><AdminScreen /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} /> 
        <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
        
        {/* USER ROUTES */}
        <Route path="/home" element={<HomeScreen />}/>
        <Route path="/emergency" element={<EmergencyScreen />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/message" element={<Message />} />
        <Route path="/profile" element={<PersonalDetails />} />
      </Routes>
    </HashRouter>
  );
}

export default App;