import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import Auth from "./auth/Auth.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import PersonalDetails from "./pages/PersonalDetails.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ErrorBoundary>
            <HomeScreen />
            </ErrorBoundary>
        }
      />
        <Route path="/profile" element={<PersonalDetails />} />
      </Routes>
    </HashRouter>
  );
}

export default App;