import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Auth from './Auth.jsx';
import './index.css';

// --- ADD THIS FUNCTION ---
const hideSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.classList.add('fade-out');
    // Remove it from the DOM entirely after the fade animation (0.5s)
    setTimeout(() => {
      splash.style.display = 'none';
    }, 500);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Call the function after rendering
hideSplashScreen();