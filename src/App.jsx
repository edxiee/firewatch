import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import Auth from "./auth/Auth.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import PersonalDetails from "./pages/PersonalDetails.jsx";
import EmergencyScreen from "./pages/EmergencyScreen.jsx";
import Notification from "./pages/Notification.jsx"; // Import singular to match your file
import Message from "./pages/Message.jsx";           // Import singular to match your file

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />     
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