import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import Auth from "./auth/Auth.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import PersonalDetails from "./pages/PersonalDetails.jsx";
import EmergencyScreen from "./pages/EmergencyScreen.jsx";
import Notification from "./pages/Notification.jsx"; 
import Message from "./pages/Message.jsx"; 

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Step 1: User lands on the Login/Auth page */}
        <Route path="/" element={<Auth />} /> 
        
        {/* Step 2: User goes here ONLY if it's their first login */}
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Step 3: The main app */}
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